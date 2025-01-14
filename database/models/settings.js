const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    roles: { type: [String], default: [] }, // Liste des rôles autorisés
    questions: { type: [String], default: ['Pourquoi voulez-vous ce rôle ?', 'Quelles sont vos qualifications ?'] }, // Questions par défaut
    applicationChannelId: { type: String, default: null }, // Salon où envoyer les candidatures
    isEnabled: { type: Boolean, default: false }, // Système activé ou non
});

module.exports = mongoose.model('Settings', settingsSchema);