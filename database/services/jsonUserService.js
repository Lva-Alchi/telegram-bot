const fs = require('fs').promises; const path = 
require('path');
// Menentukan lokasi file database.json (akan dibuat di 
// luar folder 'database')
const dbPath = path.join(__dirname, 
'../../database.json');
// Fungsi membaca JSON
async function readDB() { try { const data = await 
        fs.readFile(dbPath, 'utf8'); return 
        JSON.parse(data);
    } catch (error) {
        // Jika file database.json belum ada, buat 
        // otomatis
        const initialData = { users: [] }; await 
        fs.writeFile(dbPath, 
        JSON.stringify(initialData, null, 2)); return 
        initialData;
    }
}
// Fungsi menyimpan ke JSON
async function writeDB(data) { await 
    fs.writeFile(dbPath, JSON.stringify(data, null, 
    2));
}
module.exports = {
    // Fungsi utama untuk mengambil atau mendaftarkan 
    // user
    async getOrCreateUser(telegramId, username) { const 
        db = await readDB();
        
        // Cari user berdasarkan ID
        let user = db.users.find(u => u.telegramId === 
        telegramId.toString());
        
        // Jika user tidak ditemukan, buat data baru
        if (!user) { user = { telegramId: 
                telegramId.toString(), username: 
                username || 'Unknown', customId: 
                `USER-${telegramId}`, limitQuota: 100, 
                language: 'id', joinedAt: new 
                Date().toISOString()
            };
            
            db.users.push(user); await writeDB(db); // 
            Simpan perubahan console.log(`[DB] User 
            baru terdaftar: ${username}`);
        }
        
        return user;
    }
};
