const userServices = require('../../database/services/userService.js');
const t = require('../../lib/utils/i18n.js');

module.exports = {
  name: 'delUser',
  description: 'Menghapus database target user',
  showInMenu: true,
  async execute(ctx) {
    const adminIds = process.env.ADMIN_IDS.split(',');
    const userId = ctx.from.id.toString();
    if (!adminIds.includes(userId)) {
        return ctx.reply('⛔ Akses Ditolak: Kamu bukan Admin.');
    }
    
    const text = ctx.message.text;
    const args = text.split(/\s+/); 
    const command = args[0].toLowerCase(); 
    const targetIds = args.slice(1);
    
    if (targetIds.length === 0) {
      return ctx.reply('⚠️ Harap masukkan setidaknya satu ID user.\nFormat: `/deleteUser <id1> <id2> ...`', { parse_mode: 'Markdown' });
        }
    let successCount = 0;
    for (const targetId of targetIds) {
      const deleted = await userServices.deleteUsers(targetId);
      if (deleted) successCount++;
        }
    if (successCount > 0) {
      return ctx.reply(`🗑️ Selesai: Berhasil menghapus ${successCount} dari ${targetIds.length} user.`);
    } else {
      return ctx.reply('‼️Error: User tidak dalam database bot')
    }
  }
};