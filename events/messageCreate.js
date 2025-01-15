const ChatbotConfig = require('../database/models/ChatbotConfig');
const { getChatGPTResponse } = require('../utils/chatgpt');
const Conversation = require('../database/models/Conversation');
const { EmbedBuilder } = require('discord.js');

async function splitMessageAndReply(message, content) {
    const MAX_CHARACTERS = 2000;
    if (content.length <= MAX_CHARACTERS) {
        await message.reply(content);
    } else {
        const parts = content.match(/.{1,2000}/g);
        for (const part of parts) {
            await message.reply(part);
        }
    }
}

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const config = await ChatbotConfig.findOne({ serverId: message.guild.id });
        if (!config || message.channel.id !== config.channelId) return;

        const userId = message.author.id;

        let conversation = await Conversation.findOne({ userId, serverId: message.guild.id });
        if (!conversation) {
            conversation = new Conversation({ userId, serverId: message.guild.id, messages: [] });
        }

        conversation.messages.push({ role: 'user', content: message.content });

        try {
            const response = await getChatGPTResponse(conversation.messages);

            conversation.messages.push({ role: 'assistant', content: response });
            await conversation.save();

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setDescription(response)
                .setFooter({
                    text: `Réponse pour ${message.author.username}`,
                    iconURL: message.author.displayAvatarURL(),
                });
            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors de l’appel à OpenAI :', error);
            await message.reply("Désolé, une erreur est survenue lors de ma réponse.");
        }
    },
};
