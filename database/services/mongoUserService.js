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
    }
};