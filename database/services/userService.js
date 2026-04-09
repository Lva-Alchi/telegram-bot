const localService = require('./jsonUserService');
const mongoService = require('./mongoUserService');

const engine = process.env.DB_ENGINE.toLowerCase();

let selectedService;

if (engine === 'mongodb') {
    selectedService = mongoService;
} else if (engine === 'local') {
    selectedService = localService;
}

// Mengekspor fungsi yang terpilih agar bisa dipakai oleh file perintah bot
module.exports = selectedService;