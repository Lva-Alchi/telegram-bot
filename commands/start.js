const userService = require('../database/services/userService');

module.exports = {
    name: 'start',
    description: 'Menyapa pengguna dan mendaftarkan ke database',
    async execute(ctx) {
        const userId = ctx.from.id;
        const username = ctx.from.username || ctx.from.first_name || 'Teman';
        
        let userData = await userService.getUser(userId);
        if (!userData) {
          const msg = `Halo ${username}! \n\n Kamu belum terdaftar di database nih... > ketik /login untuk daftar`
          ctx.replyWithMarkdown(msg);
          
        } else {
        // Balas pesan ke user
        const replyMessage = `Selamat datang kembali ${username}! 👋\n\n` +
                             `Apa kabar? Baik baik aja kan...\n`;
        ctx.replyWithMarkdown(replyMessage);
      }
    }
};
