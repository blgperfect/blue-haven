const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // ID de l'utilisateur
    serverId: { type: String, required: true }, // ID du serveur
    messages: { type: Array, default: [] }, // Liste des messages (contexte)
});

module.exports = mongoose.model('Conversation', conversationSchema);
