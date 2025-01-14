const mongoose = require('mongoose');

const planningConfigSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true }, // ID du serveur Discord
    announcementChannelId: { type: String, default: null }, // ID du canal d'annonce
    defaultRoleId: { type: String, default: null }, // Rôle par défaut pour les événements
    timezone: { type: String, default: 'fr' }, // Fuseau horaire (fr, enUS, enCA)
    createdAt: { type: Date, default: Date.now }, // Date de création de la configuration
});

module.exports = mongoose.model('PlanningConfig', planningConfigSchema);
