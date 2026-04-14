const userServices = require('../database/services/userService.js');
const t = require('../lib/utils/i18n.js');

module.exports = {
  name: ['deleteUser', 'ban', 'unban'], 
  description: "[ADMIN] commands for admins",
  async execute(ctx) {
    // 1. Check for admins ID
    const adminIds = process.env.ADMIN_IDS.split(',');
    const userId = ctx.from.id.toString();
    
    if (!adminIds.includes(userId)) {
        return ctx.reply('⛔ Akses Ditolak: Kamu bukan Admin.');
    }
    
    // 2. Split arguments and commands
    const text = ctx.message.text;
    const args = text.split(/\s+/); 
    const command = args[0].toLowerCase(); 
    const targetIds = args.slice(1);
    
    // 3. Commands code starts here
    if (command === '/deleteuser') {
        if (targetIds.length === 0) {
            return ctx.reply('⚠️ Harap masukkan setidaknya satu ID user.\nFormat: `/deleteUser <id1> <id2> ...`', { parse_mode: 'Markdown' });
        }

        let successCount = 0;
        for (const targetId of targetIds) {
            const deleted = await userServices.deleteUsers(targetId);
            if (deleted) successCount++;
        }
        return ctx.reply(`🗑️ Selesai: Berhasil menghapus ${successCount} dari ${targetIds.length} user.`);
        
    } 
    else if (command === '/ban') {
        if (targetIds.length === 0) {
            return ctx.reply('⚠️ Harap masukkan setidaknya satu ID user.\nFormat: `/ban <id1> <id2> ...`', { parse_mode: 'Markdown' });
        }

        let successCount = 0;
        for (const targetId of targetIds) {
            const banned = await userServices.updateUser(targetId, { isBanned: true });
            if (banned) successCount++;
        }
        return ctx.reply(`🚫 Selesai: Berhasil mem-Banned ${successCount} dari ${targetIds.length} user.`);

    } 
    else if (command === '/unban') {
        if (targetIds.length === 0) {
            return ctx.reply('⚠️ Harap masukkan setidaknya satu ID user.\nFormat: `/unban <id1> <id2> ...`', { parse_mode: 'Markdown' });
        }

        let successCount = 0;
        for (const targetId of targetIds) {
            const unbanned = await userServices.updateUser(targetId, { isBanned: false });
            if (unbanned) successCount++;
        }
        return ctx.reply(`✅ Selesai: Berhasil melakukan Unban pada ${successCount} dari ${targetIds.length} user.`);
    }
  }
};