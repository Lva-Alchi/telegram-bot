// Memuat konfigurasi dari file .env
require('dotenv').config();
const userService = require('./database/services/userService');
const { connectDB } = require('./database/connection');
connectDB();

const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

// Mengambil token dan membuat instance bot Telegraf
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(token);

// =======================================
// 1. SANG PENJAGA GERBANG (MIDDLEWARE)
// =======================================
bot.use(async (ctx, next) => {
    if (!ctx.from) return next();

    // PENGECEKAN UTAMA
    const userId = ctx.from.id;
    const tks = ctx.message?.text || '';
    const callbackData = ctx.callbackQuery?.data || '';
    const userData = await userService.getUser(userId);
    
    //Block unwanted user
    if (userData && userData.isBanned) {
        const pesanBanned = '🚫 **AKUN DIBLOKIR**\n\nMaaf, kamu telah diblokir oleh Admin karena melanggar aturan dan tidak dapat menggunakan bot ini lagi.';
        
        if (ctx.message) return await ctx.reply(pesanBanned, { parse_mode: 'Markdown' });
        if (ctx.callbackQuery) return await ctx.answerCbQuery('Akun kamu telah diblokir Admin!', { show_alert: true });
        
        return;
    }
    
    // DAFTAR PUTIH (Whitelist)
    if (tks.startsWith('/start') || tks.startsWith('/login') || callbackData === 'btn_login') {
        ctx.dbUser = await userService.getUser(userId);
        return next();
    }

    if (!userData) {
        const pesanTolak = '🛑 **Akses Ditolak!**\n\nKamu belum terdaftar di sistem kami. Silakan registrasi terlebih dahulu untuk menggunakan fitur bot.';
        const tombolMulai = {
            reply_markup: {
                inline_keyboard: [[ { text: '🚀 Login / Sign-Up', callback_data: 'btn_login' } ]]
            },
            parse_mode: 'Markdown'
        };

        if (ctx.message) return await ctx.reply(pesanTolak, tombolMulai);
        if (ctx.callbackQuery) return await ctx.answerCbQuery('Akses ditolak! Silakan registrasi dulu.', { show_alert: true });
        return;
    }

    // TITIPKAN DATA
    ctx.dbUser = userData;
    return next();
});


// ======================================
// 2. SISTEM MODULAR (AUTO-LOAD COMMANDS)
// ======================================
bot.commandsList = new Map(); // Buat buku telepon

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if (command.name && command.execute) {
        // Simpan ke buku telepon
        bot.commandsList.set(command.name, command); 
        
        // Daftarkan ke Telegraf
        bot.command(command.name, async (ctx) => {
            try {
                await command.execute(ctx);
            } catch (error) {
                console.error(`Error saat mengeksekusi /${command.name}:`, error);
                await ctx.reply('Maaf, terjadi kesalahan saat menjalankan perintah tersebut.');
            }
        });
        console.log(`[INFO] Berhasil memuat perintah: /${command.name}`);
    } else {
        console.log(`[WARNING] File ${file} tidak memiliki struktur yang benar.`);
    }
}


// ======================================
// 3. BUTTON INTERACTION 
// ======================================

bot.action('btn_login', async (ctx) => {
    await ctx.answerCbQuery();
    const startCommand = bot.commandsList.get('login');
    if (startCommand) {
        ctx.message = { text: '/login' }; 
        await startCommand.execute(ctx);
    } else {
        await ctx.reply('Silakan ketik /login secara manual ya.');
    }
});

bot.hears('👤 Profil', async (ctx) => {
    const profilCommand = bot.commandsList.get('profil');
    if (profilCommand) await profilCommand.execute(ctx);
});

bot.hears('💳 Cek Kuota', async (ctx) => {
    await ctx.reply(`🔋 Sisa Kuota kamu saat ini adalah: *${ctx.dbUser.limitQuota}*`, { parse_mode: 'Markdown' });
});

bot.hears('❌ Close', async (ctx) => {
    await ctx.reply('Menu ditutup. Ketik /menu untuk membuka kembali.', Markup.removeKeyboard());
});

bot.action('action_lang_en', async (ctx) => {
    await ctx.answerCbQuery(); 
    await userService.updateUser(ctx.from.id, { language: 'en' });
    await ctx.editMessageText('✅ Language successfully changed to English!');
});

bot.action('action_lang_id', async (ctx) => {
    await ctx.answerCbQuery(); 
    await userService.updateUser(ctx.from.id, { language: 'id' });
    await ctx.editMessageText('✅ Bahasa berhasil diubah ke Indonesia!');
});

bot.action('action_tutup', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();
});


// ==========================================
// 4. JALANKAN BOT
// ==========================================
bot.launch().then(() => {
    console.log(`\n\n🤖 Bot Telegram (Telegraf) sedang berjalan...`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));