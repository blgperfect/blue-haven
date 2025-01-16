const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    serverId: { type: String, required: true },
    messages: { type: Array, default: [] },
});

module.exports = mongoose.model('Conversation', conversationSchema);
