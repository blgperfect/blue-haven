const mongoose = require('mongoose');

const chatbotConfigSchema = new mongoose.Schema({
    serverId: { type: String, required: true, unique: true },
    channelId: { type: String, required: true },
});

module.exports = mongoose.model('ChatbotConfig', chatbotConfigSchema);
