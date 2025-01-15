const mongoose = require('mongoose');

const coupleSchema = new mongoose.Schema({
    user1Id: { type: String, required: true },
    user2Id: { type: String, required: true },
    serverId: { type: String, required: true },
    marriageDate: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    customizations: {
        location: { type: String, default: "" },
        message: { type: String, default: "" },
        roles: { type: [String], default: [] }
    }
});

module.exports = mongoose.model('Couple', coupleSchema);
