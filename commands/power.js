module.exports = {
    // Telegraf mendukung penggunaan Array! 
    // Jadi file ini akan dieksekusi jika admin mengetik /stop ATAU /restart
    name: ['stop', 'restart'], 
    description: '[ADMIN] Mematikan atau memulai ulang bot',
    async execute(ctx) {
        // 1. Lapis Keamanan: Cek ID Admin
        const adminIds = process.env.ADMIN_IDS.split(',');
        const userId = ctx.from.id.toString();

        if (!adminIds.includes(userId)) {
            return ctx.reply('⛔ Akses Ditolak: Kamu bukan Admin.');
        }

        // 2. Mengecek perintah mana yang diketik oleh Admin
        const text = ctx.message.text.toLowerCase();

        if (text.startsWith('/stop')) {
            await ctx.reply('🛑 *Bot sedang dimatikan...*\nSelamat tinggal!', { parse_mode: 'Markdown' });
            
            // Menggunakan setTimeout agar pesan Telegram sempat terkirim sebelum sistem dimatikan
            setTimeout(() => {
                console.log('🛑 [ADMIN] Bot dimatikan secara manual.');
                process.exit(0); // Exit 0 berarti bot mati secara normal
            }, 1000);
        } 
        else if (text.startsWith('/restart')) {
            await ctx.reply('🔄 *Memulai ulang bot...*\nBot akan kembali online dalam beberapa detik.', { parse_mode: 'Markdown' });
            
            setTimeout(() => {
                console.log('🔄 [ADMIN] Bot di-restart secara manual.');
                // Exit 1 (atau crash) akan memicu Process Manager (seperti pm2/nodemon) 
                // untuk otomatis menghidupkan bot kembali
                process.exit(1); 
            }, 1000);
        }
    }
};