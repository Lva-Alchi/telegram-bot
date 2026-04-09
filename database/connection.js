const mongoose = require('mongoose');

const engine = process.env.DB_ENGINE.toLowerCase();

async function connectDB() {
    try {
        if (engine === 'local') {
            console.log('📦 [DATABASE] Berjalan menggunakan JSON Lokal (Tanpa Server)');
        } else if (engine === 'mongodb') {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('📦 [DATABASE] Berhasil terhubung ke MongoDB (Cloud)');
        } else {
            console.error('❌ [DATABASE] Error: DB_ENGINE di .env harus "mongodb" atau "local"');
            process.exit(1);
        }
    } catch (error) {
        console.error(`❌ [DATABASE] Gagal terhubung ke ${engine}:`, error.message);
        process.exit(1);
    }
}

module.exports = { connectDB };