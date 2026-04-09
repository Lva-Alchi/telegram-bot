const mongoose = require('mongoose'); const engine = 
process.env.DB_ENGINE.toLowerCase(); async function 
connectDB() {
    try { if (engine === 'mongodb') { await 
            mongoose.connect(process.env.MONGODB_URI); 
            console.log('📦 [DATABASE] Berhasil 
            terhubung ke MongoDB (Cloud)');
        } else if (engine === 'local') {
            // Flat-file JSON tidak butuh koneksi 
            // server aktif Jadi kita cukup mengirimkan 
            // pesan konfirmasi ke terminal
            console.log('📦 [DATABASE] Berhasil 
            menggunakan JSON Database (Lokal)');
        } else {
            console.error('❌ [DATABASE] Error: 
            DB_ENGINE di .env harus "mongodb" atau 
            "local"'); process.exit(1);
        }
    } catch (error) {
        console.error(`❌ [DATABASE] Gagal terhubung ke 
        ${engine}:`, error.message); process.exit(1);
    }
}
// Kita tidak perlu lagi mengekspor 'sequelize'
module.exports = { connectDB };
