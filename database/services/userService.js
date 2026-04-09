const mongoService = require('./mongoUserService'); 
const localService = require('./jsonUserService'); // 
Memanggil file JSON yang tadi kita buat const engine = 
process.env.DB_ENGINE.toLowerCase(); let 
selectedService; if (engine === 'mongodb') {
    selectedService = mongoService;
} else if (engine === 'local') {
    selectedService = localService;
}
// Mengekspor fungsi yang dipilih ke bot utama
module.exports = selectedService;
