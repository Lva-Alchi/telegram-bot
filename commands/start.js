const userService = require('../database/services/userService');

module.exports = {
    name: 'start',
    description: 'Menyapa pengguna dan mendaftarkan ke database',
    async execute(ctx) {
        // Ambil data dari Telegram
        const userId = ctx.from.id;
        const username = ctx.from.username || ctx.from.first_name || 'Teman';
        
        // --- PROSES DATABASE SANGAT SIMPEL ---
        // Bot tidak perlu tahu ini pakai JSON atau MongoDB!
        const userData = await userService.getOrCreateUser(userId, username);
        
        // Balas pesan ke user
        const replyMessage = `Halo ${username}! 👋\n\n` +
                             `Kamu berhasil terdaftar di sistem kami.\n` +
                             `🆔 Custom ID: \`${userData.customId}\`\n` +
                             `🔋 Sisa Kuota: *${userData.limitQuota}* kali`;
                             
        ctx.replyWithMarkdown(replyMessage);
    }
};
