const userService = require('../../database/services/userService');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const simbol = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣'];
const getRand = () => simbol[Math.floor(Math.random() * simbol.length)];

module.exports = {
    name: ['slot'],
    description: 'Main mesin slot 3x3 (Harga: 1 Kuota)',
    showInMenu: true,
    async execute(ctx) {
        const user = ctx.dbUser;

        // 1. Validasi Saldo
        if (user.limitQuota < 1) {
            return await ctx.reply('⚠️ **Saldo Tidak Cukup!**\nKamu butuh minimal 1 Kuota untuk memutar mesin slot.');
        }

        // 2. Tarik Biaya di Awal (Cegah eksploitasi jika user mematikan internet saat animasi)
        let currentQuota = user.limitQuota - 1;
        await userService.updateUser(user.telegramId, { limitQuota: currentQuota });

        // Pesan awalan agar Telegram mendeteksi message_id untuk diedit
        const pesanAwal = await ctx.reply('🎰 **MESIN SLOT MENYALA...** 🎰\n\nMemasukkan koin...');

        // 3. RNG (Random Number Generator) Penentu Hadiah
        const rng = Math.random();
        let hadiah = 0;
        
        if (rng < 0.50)      { hadiah = 0; } // 50% Zonk
        else if (rng < 0.75) { hadiah = 1; } // 25% Balik Modal
        else if (rng < 0.87) { hadiah = 2; } // 12% Untung 2
        else if (rng < 0.94) { hadiah = 3; } // 7% Untung 3
        else if (rng < 0.975){ hadiah = 4; } // 3.5% Untung 4
        else if (rng < 0.990){ hadiah = 5; } // 1.5% Untung 5
        else if (rng < 0.998){ hadiah = 6; } // 0.8% Mantap
        else                 { hadiah = 7; } // 0.2% JACKPOT 777!

        // 4. Siapkan Hasil Akhir (Final Grid 3x3)
        // Baris Atas & Bawah murni acak sebagai pemanis
        const finalTop = [getRand(), getRand(), getRand()];
        const finalBot = [getRand(), getRand(), getRand()];
        let finalMid = []; // Ini Payline (Penentu!)

        if (hadiah === 0) {
            // Jika Zonk, pastikan baris tengah tidak kembar 3
            finalMid = [getRand(), getRand(), '💩'].sort(() => Math.random() - 0.5);
        } else {
            // Jika menang, baris tengah kembar 3 sesuai kelas hadiahnya
            const simbolMenang = simbol[hadiah - 1];
            finalMid = [simbolMenang, simbolMenang, simbolMenang];
        }

        // 5. ANIMASI ROLLING (Gulungan Berhenti Satu per Satu)
        // Kita akan melakukan 4 frame (Semua muter -> K1 stop -> K1,K2 stop -> Semua stop)
        for (let frame = 0; frame <= 3; frame++) {
            let displayTop = [], displayMid = [], displayBot = [];

            // Membangun kolom per kolom
            for (let col = 0; col < 3; col++) {
                if (col < frame) {
                    // Gulungan sudah berhenti, tampilkan hasil final di kolom ini
                    displayTop.push(finalTop[col]);
                    displayMid.push(finalMid[col]);
                    displayBot.push(finalBot[col]);
                } else {
                    // Gulungan masih berputar, tampilkan simbol acak atau blur
                    displayTop.push(frame === 0 ? '🔄' : getRand());
                    displayMid.push(frame === 0 ? '🔄' : getRand());
                    displayBot.push(frame === 0 ? '🔄' : getRand());
                }
            }

            // Merakit visual grid teks
            let teksGrid = `🎰 **CASINO ROYAL** 🎰\n\n`;
            teksGrid += `| ${displayTop.join(' | ')} |\n`;
            teksGrid += `| ${displayMid.join(' | ')} | ⬅️ *PAYLINE*\n`; // Baris penentu ada panahnya
            teksGrid += `| ${displayBot.join(' | ')} |\n\n`;
            
            if (frame < 3) {
                teksGrid += `*Mesin sedang berputar...*`;
            } else {
                teksGrid += `*Menghitung hasil...*`;
            }

            // Edit pesan di Telegram
            await ctx.telegram.editMessageText(
                ctx.chat.id, 
                pesanAwal.message_id, 
                null, 
                teksGrid, 
                { parse_mode: 'Markdown' }
            );

            // Jeda sebelum frame berikutnya (700ms adalah sweet spot agar bot tidak terkena limit)
            if (frame < 3) await delay(700);
        }

        // 6. Eksekusi Hadiah & Pesan Penutup
        if (hadiah > 0) {
            currentQuota += hadiah;
            await userService.updateUser(user.telegramId, { limitQuota: currentQuota });
        }

        let teksHasil = `🎰 **CASINO ROYAL** 🎰\n\n`;
        teksHasil += `| ${finalTop.join(' | ')} |\n`;
        teksHasil += `| ${finalMid.join(' | ')} | ⬅️ *PAYLINE*\n`;
        teksHasil += `| ${finalBot.join(' | ')} |\n\n`;

        if (hadiah === 7) {
            teksHasil += `🎉 **J A C K P O T ! ! !** 🎉\n🔥 Gila! Kamu memenangkan **${hadiah} Kuota**!\n`;
        } else if (hadiah > 1) {
            teksHasil += `✨ **MENANG!** Kamu mendapatkan **${hadiah} Kuota**.\n`;
        } else if (hadiah === 1) {
            teksHasil += `👍 **Balik Modal!** Kamu mendapatkan **${hadiah} Kuota**.\n`;
        } else {
            teksHasil += `💀 **ZONK!** Sayang sekali, coba lagi ya.\n`;
        }
        
        teksHasil += `\n🔋 Sisa Kuota kamu: *${currentQuota}*`;

        await delay(500);
        await ctx.telegram.editMessageText(
            ctx.chat.id, 
            pesanAwal.message_id, 
            null, 
            teksHasil, 
            { parse_mode: 'Markdown' }
        );
    }
};