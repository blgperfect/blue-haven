// /database/models/ChatbotConfig.js
const mongoose = require('mongoose');

const chatbotConfigSchema = new mongoose.Schema({
    serverId: { type: String, required: true, unique: true }, // ID du serveur
    channelId: { type: String, required: false }, // ID du salon configuré
});

module.exports = mongoose.model('ChatbotConfig', chatbotConfigSchema);
