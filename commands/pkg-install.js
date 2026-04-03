const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

module.exports = {
    name: 'install',
    description: '[ADMIN] Menginstal package npm',
    async execute(ctx) {
        // 1. Lapis Keamanan 1: Cek ID Admin
        const adminIds = process.env.ADMIN_IDS.split(',');
        const userId = ctx.from.id.toString();
        
        if (!adminIds.includes(userId)) {
            return ctx.reply('⛔ Akses Ditolak: Kamu bukan Admin.');
        }

        // 2. Mengambil nama package dari teks pesan
        const textParts = ctx.message.text.split(' ');
        const pkgName = textParts[1];

        // 3. Lapis Keamanan 2: Validasi karakter berbahaya (Mencegah Command Injection)
        if (!pkgName || !/^[a-zA-Z0-9\-_.@\/]+$/.test(pkgName)) {
            return ctx.reply('⚠️ Format salah atau karakter dilarang!\nGunakan: /install <nama-package>');
        }

        const msg = await ctx.reply(`⏳ Sedang menginstal *${pkgName}*...\nMohon tunggu, proses ini memakan waktu.`, { parse_mode: 'Markdown' });

        try {
            // Mengeksekusi perintah terminal
            const { stdout, stderr } = await execPromise(`npm install ${pkgName}`);
            
            // Mengirim log keberhasilan (dibatasi 1000 karakter agar tidak spam)
            ctx.reply(`✅ *BERHASIL MENGINSTAL ${pkgName}!*\n\n*Log:*\n\`\`\`text\n${stdout.substring(0, 1000)}\n\`\`\``, { parse_mode: 'Markdown' });
        } catch (error) {
            ctx.reply(`❌ *GAGAL MENGINSTAL!*\n\n*Error:*\n\`\`\`text\n${error.message.substring(0, 1000)}\n\`\`\``, { parse_mode: 'Markdown' });
        }
    }
};