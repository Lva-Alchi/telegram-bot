const fs = require('fs');
const path = require('path');

// Tempat menyimpan data bahasa di memori agar cepat (Caching)
const locales = {};
const localesPath = path.join(__dirname, '../database/locales');

// Fungsi untuk memuat semua file JSON dari folder locales secara otomatis
function loadLocales() {
    const files = fs.readdirSync(localesPath).filter(file => file.endsWith('.json'));
    
    files.forEach(file => {
        const langCode = file.replace('.json', '');
        const content = fs.readFileSync(path.join(localesPath, file), 'utf8');
        locales[langCode] = JSON.parse(content);
    });
    console.log(`🌍 [i18n] Berhasil load ${files.length} bahasa.`);
}

// Jalankan pemuatan saat bot pertama kali nyala
loadLocales();

function translate(langCode, key, params = {}) {
    // Ambil teks dari memori. Jika bahasa tidak ada, pakai 'id'.
    let text = locales[langCode]?.[key] || locales['id']?.[key] || key;
    
    // Ganti variabel {key} dengan data asli
    for (const [pKey, pValue] of Object.entries(params)) {
        text = text.replace(new RegExp(`{${pKey}}`, 'g'), pValue);
    }
    
    return text;
}

module.exports = translate;