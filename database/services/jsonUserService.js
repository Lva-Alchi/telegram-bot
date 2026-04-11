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
    },
    // Fungsi untuk menghapus satu atau banyak user
    async deleteUsers(telegramIds) {
        try {
            const db = await readDB();
            // Jika input adalah satu ID (string), ubah jadi array
            const idsToDelete = Array.isArray(telegramIds) ? telegramIds : [telegramIds.toString()];
            
            const initialCount = db.users.length;
            // Filter: Hanya simpan user yang ID-nya TIDAK ada di list hapus
            db.users = db.users.filter(u => !idsToDelete.includes(u.telegramId));
            
            await writeDB(db);
            return initialCount - db.users.length; // Mengembalikan jumlah user yang terhapus
        } catch (error) {
            console.error('Error JSON deleteUsers:', error);
            throw error;
        }
    },

    // Fungsi untuk mengedit variabel spesifik
    async updateUser(telegramId, updateData) {
        try {
            const db = await readDB();
            const index = db.users.findIndex(u => u.telegramId === telegramId.toString());
            
            if (index !== -1) {
                // Menggabungkan data lama dengan data baru (updateData)
                db.users[index] = { ...db.users[index], ...updateData };
                await writeDB(db);
                return db.users[index];
            }
            return null;
        } catch (error) {
            console.error('Error JSON updateUser:', error);
            throw error;
        }
    }
};