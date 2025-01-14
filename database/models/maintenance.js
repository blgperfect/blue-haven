const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    _id: { type: String, default: 'global' }, // ID unique pour une gestion globale
    maintenance: { type: Boolean, required: true, default: false }, // Indique si la maintenance est activée
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
