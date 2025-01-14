const mongoose = require('mongoose');

const planningEventSchema = new mongoose.Schema({
    guildId: { type: String, required: true }, // ID du serveur Discord
    name: { type: String, required: true }, // Nom de l'événement
    date: { type: Date, required: true }, // Date et heure de l'événement
    description: { type: String, default: 'Aucune description.' }, // Description de l'événement
    roleId: { type: String, default: null }, // ID du rôle associé à l'événement
    participants: { type: [String], default: [] }, // Liste des IDs des participants
    createdAt: { type: Date, default: Date.now }, // Date de création de l'événement
});

module.exports = mongoose.model('PlanningEvent', planningEventSchema);
