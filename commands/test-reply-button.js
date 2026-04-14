const { Markup } = require('telegraf');

module.exports = {
    name: 'replyButton',
    description: 'Menampilkan menu utama di bawah layar',
    async execute(ctx) {
        const pesan = 'Selamat datang di Menu Utama!';

        const keyboard = Markup.keyboard([
            // Baris 1: Tombol teks biasa
            ['👤 Profil', '💳 Saldo'],
            
            // Baris 2: Tombol Spesial (Meminta Data Sensitif)
            [
                Markup.button.contactRequest('📱 Kirim Nomor HP'),
                Markup.button.locationRequest('📍 Kirim Lokasi')
            ],
            
            // Baris 3: Tombol lebar satu baris penuh
            ['❓ Bantuan']
        ])
        .resize()   // PENTING: Agar ukuran tombol menyesuaikan layar HP (tidak raksasa)
        .oneTime(); // Opsional: Tombol otomatis sembunyi setelah 1x dipencet

        await ctx.reply(pesan, keyboard);
    }
};