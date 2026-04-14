const userService = require('../database/services/userService');
const t = require('../lib/utils/i18n');

module.exports = {
    name: 'start',
    description: 'Menyapa pengguna dan mendaftarkan ke database',
    async execute(ctx) {
        const userId = ctx.from.id;
        const username = ctx.from.username || ctx.from.first_name || 'Teman';
        
        let userData = await userService.getUser(userId);
        if (!userData) {
          const msg = t(userData.language, 'unregistered', {name: username})
          ctx.replyWithMarkdown(msg);
          
        } else {
        // Balas pesan ke user
        const replyMessage = t(userData.language, 'welcome_back', {name: username, id: userId, quota: userData.limitQuota});
        ctx.replyWithMarkdown(replyMessage);
      }
    }
};
