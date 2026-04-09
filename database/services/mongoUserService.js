const User = require('../models/UserMongo'); 
module.exports = {
    async getOrCreateUser(telegramId, username) { try { 
            let user = await User.findOne({ telegramId: 
            telegramId.toString() });
            
            if (!user) { user = await User.create({ 
                    telegramId: telegramId.toString(), 
                    username: username || 'Unknown', 
                    customId: `USER-${telegramId}`
                });
                console.log(`[DB-MONGO] User baru 
                terdaftar: ${username}`);
            }
            return user;
        } catch (error) {
            console.error('Error Mongoose 
            getOrCreateUser:', error); throw error;
        }
    }
};
