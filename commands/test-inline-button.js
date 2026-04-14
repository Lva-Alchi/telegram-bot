const { Markup } = require('telegraf');

module.exports = {
    name: 'inlineButton',
    description: 'Menampilkan variasi tombol inline',
    async execute(ctx) {
        const pesan = 'Pilih salah satu variasi tombol di bawah ini:';

        // Array di dalam array menentukan Baris dan Kolom
        const keyboard = Markup.inlineKeyboard([
            // Baris 1: Dua tombol sejajar (Callback)
            [
                Markup.button.callback('✅ Setuju', 'action_setuju'),
                Markup.button.callback('❌ Batal', 'action_batal')
            ],
            // Baris 2: Tombol Link / URL (Melempar user keluar Telegram)
            [
                Markup.button.url('🌐 Kunjungi Website Kami', 'https://github.com/Lva-Alchi')
            ],
            // Baris 3: Tombol Web App (Membuka website di dalam Telegram - Fitur Baru!)
            [
                Markup.button.webApp('🚀 Buka Mini App', 'https://core.telegram.org/bots/webapps')
            ],
            // Baris 4: Tombol Share (Mengarahkan user untuk membagikan teks ke teman)
            [
                Markup.button.switchToChat('Bagikan Bot Ini', 'Coba deh bot keren ini!')
            ]
        ]);

        await ctx.reply(pesan, keyboard);
    }
};