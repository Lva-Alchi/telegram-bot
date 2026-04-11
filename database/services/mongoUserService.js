const User = require('../models/UserMongo');

module.exports = {
    // Fungsi 1: Hanya untuk MENCARI data user
    async getUser(telegramId) {
        try {
            const user = await User.findOne({ telegramId: telegramId.toString() });
            return user; // Akan mengembalikan null jika user tidak ditemukan
        } catch (error) {
            console.error('Error Mongoose getUser:', error);
            throw error;
        }
    },


    async createUser(telegramId, username) {
        try {
            const newUser = await User.create({
                telegramId: telegramId.toString(),
                username: username || 'Unknown',
                customId: `USER-${telegramId}`
            });
            console.log(`[DB-MONGO] User baru terdaftar: ${username}`);
            return newUser;
        } catch (error) {
            console.error('Error Mongoose createUser:', error);
            throw error;
        }
    },
    
    async deleteUsers(telegramIds) {
        try {
            const idsToDelete = Array.isArray(telegramIds) ? telegramIds : [telegramIds.toString()];
            // Menghapus semua user yang telegramId-nya ada di dalam array idsToDelete
            const result = await User.deleteMany({ telegramId: { $in: idsToDelete } });
            return result.deletedCount;
        } catch (error) {
            console.error('Error Mongo deleteUsers:', error);
            throw error;
        }
    },

    async updateUser(telegramId, updateData) {
        try {
            // { new: true } agar mengembalikan data yang SUDAH diupdate
            const updatedUser = await User.findOneAndUpdate(
                { telegramId: telegramId.toString() },
                { $set: updateData },
                { new: true }
            );
            return updatedUser;
        } catch (error) {
            console.error('Error Mongo updateUser:', error);
            throw error;
        }
    }
};