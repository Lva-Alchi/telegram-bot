module.exports = {
    name: 'start',
    description: 'Menyapa pengguna saat memulai bot',
    execute(ctx) {
        // Mengambil nama depan pengirim, default ke 'Teman' jika kosong
        const firstName = ctx.from.first_name || 'Teman';
        
        const replyMessage = `Halo ${firstName}! 👋\nSelamat datang di bot ini. Ketik /help untuk melihat apa yang bisa aku lakukan.`;
        
        // Membalas pesan secara langsung
        ctx.reply(replyMessage);
    }
};
