const userService = require('../database/services/userService');

module.exports = {
      name: 'login',
      description: 'login to create your first account!',
      async execute(ctx) {
        const userId = ctx.from.id;
        const username = ctx.from.username || ctx.from.first_name || 'Teman';
        
        let userData = await userService.getUser(userId);
        
        if (!userData) {
          userData = await userService.createUser(userId, username);
          
          const msg = `Halo ${username}! 👋\n\n` +
                             `Kamu berhasil terdaftar di sistem kami.\n` +
                             `🆔 Custom ID: \`${userData.customId}\`\n` +
                             `🔋 Sisa Kuota: *${userData.limitQuota}* kali`;
          await ctx.replyWithMarkdown(msg);
          
        } else {
          const msg = `Hai ${username}! 👋\n\n` +
          `Kamu sudah terdaftar dengan \`🆔 ${userData.customId}\`\n` +
          `Kamu punya *${userData.limitQuota}*⚡ limit penggunaan yang tersia!`;
          
          ctx.replyWithMarkdown(msg);
        }
      }
};
