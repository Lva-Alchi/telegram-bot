const fs = require('fs').promises;
const path = require('path');

// Lokasi file akan otomatis dibuat di folder utama project-mu
const dbPath = path.join(__dirname, '../../database.json');

async function readDB() {
    try {
        const data = await fs.readFile(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Jika file belum ada, buat otomatis
        const initialData = { users: [] };
        await fs.writeFile(dbPath, JSON.stringify(initialData, null, 2));
        return initialData;
    }
}

async function writeDB(data) {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2)); 
}

module.exports = {
    async getOrCreateUser(telegramId, username) {
        try {
            const db = await readDB();
            let user = db.users.find(u => u.telegramId === telegramId.toString());
            
            if (!user) {
                user = {
                    telegramId: telegramId.toString(),
                    username: username || 'Unknown',
                    customId: `USER-${telegramId}`,
                    limitQuota: 100,
                    language: 'id',
                    joinedAt: new Date().toISOString()
                };
                
                db.users.push(user);
                await writeDB(db);
                console.log(`[DB-JSON] User baru terdaftar: ${username}`);
            }
            return user;
        } catch (error) {
            console.error('Error JSON getOrCreateUser:', error);
            throw error;
        }
    }
};