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
    
    // Memastikan file memiliki 'name' dan 'execute'
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

// Menjalankan bot
bot.launch();
console.log(`\n\n🤖 Bot Telegram (Telegraf) sedang berjalan...`);

// Menghentikan bot dengan aman (Graceful stop) jika server dimatikan
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
