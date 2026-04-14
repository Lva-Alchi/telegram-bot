const User = require('../models/UserMongo');

module.exports = {
    async getUser(telegramId) {
        try {
            const user = await User.findOne({ telegramId: telegramId.toString() });
            return user;
        } catch (error) {
            console.error('Error Mongoose getUser:', error);
            throw error;
        }
    },


    async createUser(telegramId, username, language = 'id') {
        try {
            const newUser = await User.create({
                telegramId: telegramId.toString(),
                username: username || 'Unknown',
                customId: `USER-${telegramId}`,
                language: language
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
            const result = await User.deleteMany({ telegramId: { $in: idsToDelete } });
            return result.deletedCount;
        } catch (error) {
            console.error('Error Mongo deleteUsers:', error);
            throw error;
        }
    },

    async updateUser(telegramId, updateData) {
        try {
            const updatedUser = await User.findOneAndUpdate(
                { telegramId: telegramId.toString() },
                { $set: updateData },
                { returnDocument: 'after' }
            );
            return updatedUser;
        } catch (error) {
            console.error('Error Mongo updateUser:', error);
            throw error;
        }
    }
};