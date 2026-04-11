const userService = require('../database/services/userService');

module.export = {
      name: 'login',
      description: 'login to create your first account!',
      async execute(ctx) {
        const userId = ctx.from.id;
        const username = ctx.from.username || ctx.from.first_name || 'Teman';
        
        let userData = await userService.getUser(userId);
        
        if (!userData) {
          const createData = await userService.createUser(userId, username);
          
          const msg = `Halo ${username}! 👋\n\n` +
                             `Kamu berhasil terdaftar di sistem kami.\n` +
                             `🆔 Custom ID: \`${userData.customId}\`\n` +
                             `🔋 Sisa Kuota: *${userData.limitQuota}* kali`;
          ctx.replyWithMarkdown(msg);
          
        } else {
          const msg = `Hai ${username}!\n\n` +
          `Kamu sudah terdaftar dengan ID \`${userData.customId}\`\n\n` +
          `Kamu punya *${userData.limitQuota}* limit pemggunaan yang tersia!`;
          
          ctx.replyWithMarkdown(msg);
        }
      }
};