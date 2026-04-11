module.exports = {
    // Fungsi 1: Hanya untuk MENCARI data user
    async getUser(telegramId) {
        try {
            const db = await readDB();
            const user = db.users.find(u => u.telegramId === telegramId.toString());
            return user || null; // Mengembalikan data user atau null jika tidak ada
        } catch (error) {
            console.error('Error JSON getUser:', error);
            throw error;
        }
    },

    // Fungsi 2: Hanya untuk MEMBUAT data user baru
    async createUser(telegramId, username) {
        try {
            const db = await readDB();
            
            const newUser = {
                telegramId: telegramId.toString(),
                username: username || 'Unknown',
                customId: `USER-${telegramId}`,
                limitQuota: 100,
                language: 'id',
                joinedAt: new Date().toISOString()
            };
            
            db.users.push(newUser);
            await writeDB(db); // Simpan ke file database.json
            
            console.log(`[DB-JSON] User baru terdaftar: ${username}`);
            return newUser;
        } catch (error) {
            console.error('Error JSON createUser:', error);
            throw error;
        }
    }
};