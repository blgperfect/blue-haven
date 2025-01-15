const mongoose = require('mongoose');

const chatbotConfigSchema = new mongoose.Schema({
    serverId: { type: String, required: true, unique: true }, // ID du serveur
    channelId: { type: String, required: true }, // ID du salon où le bot doit répondre
});

module.exports = mongoose.model('ChatbotConfig', chatbotConfigSchema);
