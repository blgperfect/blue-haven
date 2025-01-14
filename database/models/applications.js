const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    answers: { type: Array, required: true }, // Tableau pour stocker les réponses aux questions
    status: { type: String, default: 'en attente', enum: ['en attente', 'acceptée', 'rejetée'] },
    reason: { type: String, default: null }, // Raison en cas de rejet
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', applicationSchema);
