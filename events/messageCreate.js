const ChatbotConfig = require('../database/models/ChatbotConfig');
const { getChatGPTResponse } = require('../utils/chatgpt');

// Stocker la mémoire en RAM
const conversationMemory = {};

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const config = await ChatbotConfig.findOne({ serverId: message.guild.id });
        if (!config || message.channel.id !== config.channelId) return;

        const userId = message.author.id;

        // Initialiser la mémoire pour cet utilisateur s'il n'existe pas
        if (!conversationMemory[userId]) {
            conversationMemory[userId] = [];
        }

        // Ajouter le message de l'utilisateur à la mémoire
        conversationMemory[userId].push({ role: 'user', content: message.content });

        try {
            // Appeler OpenAI avec le contexte de la mémoire
            const response = await getChatGPTResponse(conversationMemory[userId]);

            // Ajouter la réponse de ChatGPT à la mémoire
            conversationMemory[userId].push({ role: 'assistant', content: response });

            // Répondre à l'utilisateur
            await message.reply(response);
        } catch (error) {
            console.error('Erreur lors de l’appel à OpenAI :', error);
            await message.reply("Désolé, une erreur est survenue lors de ma réponse.");
        }
    },
};
