const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

module.exports = {
    name: 'uninstall',
    description: '[ADMIN] Menghapus package npm',
    showInMenu: true,
    async execute(ctx) {
        const adminIds = process.env.ADMIN_IDS.split(',');
        if (!adminIds.includes(ctx.from.id.toString())) return ctx.reply('⛔ Akses Ditolak.');

        const textParts = ctx.message.text.split(' ');
        const pkgName = textParts[1];

        if (!pkgName || !/^[a-zA-Z0-9\-_.@\/]+$/.test(pkgName)) {
            return ctx.reply('⚠️ Format salah!\nGunakan: /uninstall <nama-package>');
        }

        const msg = await ctx.reply(`⏳ Sedang menghapus *${pkgName}*...`, { parse_mode: 'Markdown' });

        try {
            const { stdout } = await execPromise(`npm uninstall ${pkgName}`);
            ctx.reply(`🗑️ *BERHASIL MENGHAPUS ${pkgName}!*\n\n*Log:*\n\`\`\`text\n${stdout.substring(0, 1000)}\n\`\`\``, { parse_mode: 'Markdown' });
        } catch (error) {
            ctx.reply(`❌ *GAGAL MENGHAPUS!*\n\n*Error:*\n\`\`\`text\n${error.message.substring(0, 1000)}\n\`\`\``, { parse_mode: 'Markdown' });
        }
    }
};