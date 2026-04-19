const userService = require('../../database/services/userService');
const t = require('../../lib/utils/i18n.js');

module.exports = {
    name: 'setlang',
    description: 'Mengubah bahasa bot (id/en)',
    showInMenu: true,
    async execute(ctx) {
        const userId = ctx.from.id;
        const args = ctx.message.text.split(' ');
        const newLang = args[1]?.toLowerCase();

        // Validasi input
        if (newLang !== 'id' && newLang !== 'en') {
            return ctx.reply('⚠️ Format salah! Gunakan: `/setlang id` atau `/setlang en`', { parse_mode: 'Markdown' });
        }

        // Update bahasa user di Database
        const updatedUser = await userService.updateUser(userId, { language: newLang });

        if (updatedUser) {
            const msg = t(updatedUser.language, 'lang_changed');
            ctx.reply(msg);
        } else {
            ctx.reply('❌ Kamu belum terdaftar. Ketik /login dulu.');
        }
    }
};