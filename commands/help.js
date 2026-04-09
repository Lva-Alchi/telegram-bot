module.exports = {
    name: 'help',
    description: 'Menampilkan panduan penggunaan bot',
    execute(ctx) {
        const helpMessage = `
*Panduan Penggunaan Bot* 🛠️

Berikut adalah perintah yang bisa kamu gunakan:
/start - Memulai percakapan dengan bot
/help - Menampilkan pesan bantuan ini

Under Development!
        `;

        // Membalas pesan dengan format Markdown
        ctx.replyWithMarkdown(helpMessage);
    }
};
