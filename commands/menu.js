const { Markup } = require('telegraf');

module.exports = {
    name: 'menu',
    description: 'Menampilkan Menu Utama interaktif',
    async execute(ctx) {
        const pesan = '🎉 **Pusat Kendali Bot**\nSilakan ketuk salah satu menu di bawah ini:';

        // Membuat Reply Keyboard (Menu Bawah)
        const keyboard = Markup.keyboard([
            ['👤 Profil', '💳 Cek Kuota'], // Baris 1: Dua tombol sejajar
            ['❌ Close ']                   // Baris 2: Satu tombol lebar
        ]).resize(); // PENTING: Agar ukuran tombol mengecil menyesuaikan layar HP

        await ctx.replyWithMarkdown(pesan, keyboard);
    }
};