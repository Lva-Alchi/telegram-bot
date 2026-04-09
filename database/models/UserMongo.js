const mongoose = require('mongoose'); const userSchema 
= new mongoose.Schema({
    telegramId: { type: String, required: true, unique: 
    true }, username: { type: String, default: 
    'Unknown' }, customId: { type: String, default: '' 
    },
    limitQuota: { type: Number, default: 100 }, 
    language: { type: String, default: 'id' }, 
    joinedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', userSchema);
