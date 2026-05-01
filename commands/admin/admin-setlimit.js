const userService = require('../../src/database/services/userService.js');

module.exports = {
    name: 'setlimit',
    description: 'Mengubah limit kuota user',
    showInMenu: true,
    async execute(ctx) {
        // 1. Cek Admin
        const adminIds = process.env.ADMIN_IDS.split(',');
        if (!adminIds.includes(ctx.from.id.toString())) return ctx.reply('⛔ Akses Ditolak.');

        // 2. Ambil Argumen (Format: /setlimit 12345 80)
        const args = ctx.message.text.split(' ');
        const targetId = args[1];
        const newLimit = parseInt(args[2]);

        if (!targetId || isNaN(newLimit)) {
            return ctx.reply('⚠️ Format salah! Gunakan: `/setlimit <ID_USER> <JUMLAH>`', { parse_mode: 'Markdown' });
        }

        // 3. Eksekusi Update
        // Kita hanya mengirim { limitQuota: newLimit } ke fungsi updateUser
        const updated = await userService.updateUser(targetId, { limitQuota: newLimit });

        if (updated) {
            ctx.reply(`✅ Berhasil! Limit user \`${targetId}\` sekarang menjadi *${updated.limitQuota}*`, { parse_mode: 'Markdown' });
        } else {
            ctx.reply('❌ User tidak ditemukan di database.');
        }
    }
};