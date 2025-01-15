const ChatbotConfig = require('../database/models/ChatbotConfig');
const { getChatGPTResponse } = require('../utils/chatgpt');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return; // Ignorer les messages des bots

        console.log(`Message reçu : "${message.content}" dans le salon ${message.channel.id}`);

        try {
            // Récupérer la configuration du serveur
            const config = await ChatbotConfig.findOne({ serverId: message.guild.id });

            if (!config) {
                console.log('❌ Aucun salon configuré pour ce serveur.');
                return;
            }

            if (message.channel.id !== config.channelId) {
                console.log(`⚠️ Message ignoré. Chatbot configuré pour le salon : ${config.channelId}`);
                return;
            }

            console.log(`✅ Message accepté pour le chatbot : ${message.content}`);

            // Appeler l'API OpenAI
            const response = await getChatGPTResponse(message.content);

            // Répondre dans le salon
            console.log(`Réponse générée : ${response}`);
            await message.reply(response);
        } catch (error) {
            console.error('❌ Erreur lors du traitement du message :', error);
            await message.reply("Désolé, une erreur est survenue lors de ma réponse.");
        }
    },
};
