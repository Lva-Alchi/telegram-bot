const userService = require('../database/services/userService');
const t = require('../lib/utils/i18n.js');

module.exports = {
      name: 'login',
      description: 'login to create your first account!',
      showInMenu: true,
      async execute(ctx) {
        const userId = ctx.from.id;
        const username = ctx.from.username || ctx.from.first_name || 'Teman';
        
        let userData = await userService.getUser(userId);
        
        if (!userData) {
          userData = await userService.createUser(userId, username);
          
          const msg = t(userData.language, 'register_success', { id: userId, quota: userData.limitQuota });
          await ctx.replyWithMarkdown(msg);
          
        } else {
          ctx.replyWithMarkdown(await t(userData.language, 'alreadyRegistered', { id: userId, quota: userData.limitQuota }));
        }
      }
};
