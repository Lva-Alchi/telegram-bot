// Memuat konfigurasi dari file .env
require('dotenv').config();

const { connectDB } = require('./database/connection');
connectDB();

const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');

// Mengambil token dan membuat instance bot Telegraf
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(token);

// --- SISTEM MODULAR ---
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Membaca dan mendaftarkan setiap file perintah
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if (command.name && command.execute) {
        // Mendaftarkan perintah ke dalam bot Telegraf
        // (Misalnya command.name adalah 'start', ini sama dengan bot.command('start', ...))
        bot.command(command.name, (ctx) => {
            try {
                command.execute(ctx);
            } catch (error) {
                console.error(`Error saat mengeksekusi /${command.name}:`, error);
                ctx.reply('Maaf, terjadi kesalahan saat menjalankan perintah tersebut.');
            }
        });
        console.log(`[INFO] Berhasil memuat perintah: /${command.name}`);
    } else {
        console.log(`[WARNING] File ${file} tidak memiliki struktur yang benar.`);
    }
}

// --- (MIDDLEWARE) ---
bot.use(async (ctx, next) => {
    // 1. Abaikan event yang tidak memiliki ID User (misal: event bot dimasukkan ke grup)
    if (!ctx.from) return next();

    const userId = ctx.from.id;
    const tks = ctx.message?.text || '';
    const callbackData = ctx.callbackQuery?.data || '';

    // 2. DAFTAR PUTIH (Whitelist) - Perintah yang bebas diakses tanpa daftar
    // User bebas mengakses /start, /login, atau memencet tombol 'btn_login'
    if (tks.startsWith('/start') || tks.startsWith('/login') || callbackData === 'btn_login') {
        ctx.dbUser = await userService.getUser(userId);
        return next();
    }

    // 3. PENGECEKAN UTAMA UNTUK PERINTAH LAINNYA
    const userData = await userService.getUser(userId);

    if (!userData) {
        // User tidak ditemukan di database! Siapkan skenario penolakan.
        const pesanTolak = '🛑 **Akses Ditolak!**\n\nKamu belum terdaftar di sistem kami. Silakan registrasi terlebih dahulu untuk menggunakan fitur bot.';

        // Membuat tombol cantik agar UX-nya terasa profesional
        const tombolMulai = {
            reply_markup: {
                inline_keyboard: [
                    [ { text: '🚀 Login / Sign-Up', callback_data: 'btn_login' } ]
                ]
            },
            parse_mode: 'Markdown'
        };

        // Jika dia mengirim pesan teks biasa
        if (ctx.message) {
            return await ctx.reply(pesanTolak, tombolMulai);
        }
        
        // Jika dia diam-diam memencet tombol fitur lain (callback query)
        if (ctx.callbackQuery) {
            return await ctx.answerCbQuery('Akses ditolak! Silakan registrasi dulu.', { show_alert: true });
        }
        return;
    }

    // 4. TITIPKAN DATA (Super Efisien!)
    // Karena kita sudah capek-capek cari di database, kita simpan datanya di 'ctx'
    // Jadi file command seperti setlang.js tidak perlu query database lagi.
    ctx.dbUser = userData;

    // 5. LOLOS SELEKSI! Silakan masuk ke file command yang dituju
    return next();
});

// --- PENANGANAN TOMBOL MULAI REGISTRASI ---
// Ini akan merespon ketika tombol "🚀 Login / Sign-Up" ditekan
bot.action('btn_login', async (ctx) => {
    await ctx.answerCbQuery(); // Matikan animasi loading di tombol
    
    // Kita arahkan paksa bot untuk mengeksekusi file commands/login.js
    const startCommand = bot.commandsList.get('login');
    if (startCommand) {
        // Rekayasa sedikit agar file start.js mengira user mengetik /start
        ctx.message = { text: '/login' }; 
        await startCommand.execute(ctx);
    } else {
        await ctx.reply('Silakan ketik /login secara manual ya.');
    }
});
// -----------------------------------------

bot.launch();
console.log(`\n\n🤖 Bot Telegram (Telegraf) sedang berjalan...`);

// Menghentikan bot dengan aman (Graceful stop) jika server dimatikan
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
