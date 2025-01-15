const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    giverId: { type: String, required: true }, // ID de l'utilisateur qui a donné le like
    receiverId: { type: String, required: true }, // ID de la cible (couple ou célibataire)
    type: { type: String, enum: ['couple', 'celib'], required: true }, // Type de like
    date: { type: Date, default: Date.now }, // Date du like
});

module.exports = mongoose.model('Like', likeSchema);
