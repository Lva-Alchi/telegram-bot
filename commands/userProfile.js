// commands/profil.js
const { Markup } = require('telegraf');

module.exports = {
    name: 'profil',
    category: '👥 General',
    description: 'Menampilkan informasi profil pengguna',
    showInMenu: true,
    async execute(ctx) {
        const user = ctx.dbUser;
        const pesan = `👤 **INFORMASI PROFIL**\n\n` +
                      `🆔 Sistem ID: \`${user.customId}\`\n` +
                      `🗣️ Bahasa Saat Ini: *${user.language.toUpperCase()}*\n` +
                      `🔋 Sisa Kuota: *${user.limitQuota}*`;

        // Membuat Inline Keyboard (Tombol Transparan)
        const inlineKeyboard = Markup.inlineKeyboard([
            // Baris 1: Tombol ganti bahasa
            [
                Markup.button.callback('🇺🇸 English', 'action_lang_en'), 
                Markup.button.callback('🇮🇩 Indonesia', 'action_lang_id')
            ],
            // Baris 2: Tombol tutup (hapus pesan)
            [
                Markup.button.callback('❌ Tutup Profil', 'action_tutup')
            ]
        ]);

        await ctx.replyWithMarkdown(pesan, inlineKeyboard);
    }
};