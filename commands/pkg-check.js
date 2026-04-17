const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

module.exports = {
    name: 'checkpkg',
    category: '🧑‍💻 [ADMIN]',
    description: '[ADMIN] Mengecek keamanan package npm menggunakan npq',
    showInMenu: true,
    async execute(ctx) {
        const adminIds = process.env.ADMIN_IDS.split(',');
        if (!adminIds.includes(ctx.from.id.toString())) return ctx.reply('⛔ Akses Ditolak.');

        const textParts = ctx.message.text.split(' ');
        const pkgName = textParts[1];

        if (!pkgName || !/^[a-zA-Z0-9\-_.@\/]+$/.test(pkgName)) {
            return ctx.reply('⚠️ Format salah!\nGunakan: /checkpkg <nama-package>');
        }

        ctx.reply(`🕵️‍♂️ Meminta NPQ untuk mengaudit *${pkgName}*...\nIni mungkin memakan waktu beberapa detik karena NPQ harus mengunduh data dari Snyk dan Github.`, { parse_mode: 'Markdown' });

        try {
            // Trik: Menggunakan 'echo n |' untuk otomatis menolak instalasi setelah scan selesai
            // Menggunakan npx agar langsung mengeksekusi npq tanpa perlu install manual
            const { stdout, stderr } = await execPromise(`echo n | npx npq ${pkgName}`);
            
            // npq sering kali membuang outputnya ke stderr meskipun itu bukan error. 
            // Kita gabungkan stdout dan stderr agar laporan penuhnya terbaca.
            const fullLog = `${stdout}\n${stderr}`;
            
            ctx.reply(`🛡️ *HASIL AUDIT NPQ UNTUK ${pkgName}:*\n\n\`\`\`text\n${fullLog.substring(0, 3000)}\n\`\`\``, { parse_mode: 'Markdown' });
        } catch (error) {
            // exec akan melempar error jika ada 'exit code' selain 0 (yang mana sering terjadi jika npq menemukan bahaya)
            // Jadi kita tetap ambil outputnya dari object error
            const errorLog = error.stdout || error.stderr || error.message;
            ctx.reply(`⚠️ *HASIL AUDIT (Peringatan Ditemukan!):*\n\n\`\`\`text\n${errorLog.substring(0, 3000)}\n\`\`\``, { parse_mode: 'Markdown' });
        }
    }
};