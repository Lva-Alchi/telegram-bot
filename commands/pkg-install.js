const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

module.exports = {
    name: 'install',
    category: '🧑‍💻 [ADMIN]',
    description: '[ADMIN] Menginstal satu atau banyak package npm',
    showInMenu: true,
    async execute(ctx) {
        // 1. Cek ID Admin
        const adminIds = process.env.ADMIN_IDS.split(',');
        const userId = ctx.from.id.toString();
        
        if (!adminIds.includes(userId)) {
            return ctx.reply('⛔ Akses Ditolak: Kamu bukan Admin.');
        }

        // 2. Mengambil semua teks dan memisahkannya berdasarkan spasi (berapa pun jumlah spasinya)
        const textParts = ctx.message.text.trim().split(/\s+/);
        
        // Membuang kata pertama ('/install') dan mengambil sisanya
        const packages = textParts.slice(1);

        // Jika tidak ada package yang diketik
        if (packages.length === 0) {
            return ctx.reply('⚠️ Harap masukkan nama package!\nContoh: `/install express cors dotenv`', { parse_mode: 'Markdown' });
        }

        // 3. Lapis Keamanan: Validasi SETIAP package di dalam array
        const regex = /^[a-zA-Z0-9\-_.@\/]+$/;
        for (const pkg of packages) {
            if (!regex.test(pkg)) {
                return ctx.reply(`⚠️ Nama package "*${pkg}*" tidak valid atau mengandung karakter dilarang!`, { parse_mode: 'Markdown' });
            }
        }

        // 4. Menggabungkan nama-nama package menjadi satu string dengan pemisah spasi
        // Contoh hasil: "express cors dotenv"
        const pkgString = packages.join(' ');

        const msg = await ctx.reply(`⏳ Sedang menginstal:\n*${pkgString}*\n\nMohon tunggu...`, { parse_mode: 'Markdown' });

        try {
            // Mengeksekusi perintah terminal untuk multi-install
            const { stdout, stderr } = await execPromise(`npm install ${pkgString}`);
            
            // Membatasi log agar tidak kepanjangan di Telegram (maks 1000 karakter)
            const outputLog = stdout ? stdout.substring(0, 1000) : 'Proses selesai tanpa log tambahan.';
            
            ctx.reply(`✅ *BERHASIL MENGINSTAL!*\n\n*Package:* ${pkgString}\n\n*Log:*\n\`\`\`text\n${outputLog}\n\`\`\``, { parse_mode: 'Markdown' });
        } catch (error) {
            const errorLog = error.message.substring(0, 1000);
            ctx.reply(`❌ *GAGAL MENGINSTAL!*\n\n*Error:*\n\`\`\`text\n${errorLog}\n\`\`\``, { parse_mode: 'Markdown' });
        }
    }
};