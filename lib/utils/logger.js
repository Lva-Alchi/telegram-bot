const fs = require('fs');
const path = require('path');

// Tentukan direktori errors
const errorDir = path.join(__dirname, '../../errors');

// Pastikan folder errors tersedia
if (!fs.existsSync(errorDir)) {
    fs.mkdirSync(errorDir, { recursive: true });
}

/**
 * Helper untuk mendapatkan format tanggal untuk nama file
 * Hasil: 2024-05-20_14-30-05
 */
const getFileTimestamp = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-mm-ss
    return `${date}_${time}`;
};

/**
 * LOGGER 1: Untuk Error Sistem (Startup / npm run / Crash Node.js)
 */
const logSystemError = (error) => {
    const fileName = `systemError_${getFileTimestamp()}.txt`;
    const filePath = path.join(errorDir, fileName);

    const content = `
========================================
🚨 SYSTEM FATAL ERROR (STARTUP/RUNTIME)
========================================
Tanggal/Waktu : ${new Date().toLocaleString('id-ID')}
----------------------------------------
NAMA ERROR : ${error.name || 'Error'}
PESAN      : ${error.message || 'No message'}
----------------------------------------
STACK TRACE:
${error.stack || 'No stack trace available'}
========================================
`;

    fs.writeFileSync(filePath, content, 'utf8');
    console.error(`[LOGGER] 🚨 System Crash tercatat di: ${fileName}`);
};

/**
 * LOGGER 2: Untuk Error Perintah User (Interaction / Command Error)
 */
const logUserError = (error, ctx) => {
    const fileName = `userError_${getFileTimestamp()}.txt`;
    const filePath = path.join(errorDir, fileName);

    const userId = ctx?.from?.id || 'Unknown';
    const username = ctx?.from?.username || 'Unknown';
    const input = ctx?.message?.text || ctx?.callbackQuery?.data || 'Unknown Input';

    const content = `
========================================
❌ USER INTERACTION ERROR REPORT
========================================
Tanggal/Waktu : ${new Date().toLocaleString('id-ID')}
User ID       : ${userId}
Username      : @${username}
Input User    : ${input}
----------------------------------------
NAMA ERROR : ${error.name || 'Error'}
PESAN      : ${error.message || 'No message'}
----------------------------------------
STACK TRACE:
${error.stack || 'No stack trace available'}
========================================
`;

    fs.writeFileSync(filePath, content, 'utf8');
    console.error(`[LOGGER] ❌ User Error tercatat di: ${fileName}`);
};

module.exports = { logSystemError, logUserError };