const { SlashCommandBuilder } = require('discord.js');
const ChatbotConfig = require('../../database/models/ChatbotConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-chatbot')
        .setDescription('Configurer ou désactiver le chatbot dans un salon.')
        .addBooleanOption(option =>
            option.setName('activer')
                .setDescription('Activer ou désactiver le chatbot.')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Le salon où activer le chatbot.')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('Administrator')) {
            return interaction.reply({
                content: "❌ Vous devez être administrateur pour utiliser cette commande.",
                ephemeral: true,
            });
        }

        const activer = interaction.options.getBoolean('activer');
        const salon = interaction.options.getChannel('salon');

        if (activer) {
            // Vérifier si un salon est fourni
            if (!salon) {
                return interaction.reply({
                    content: "❌ Vous devez spécifier un salon pour activer le chatbot.",
                    ephemeral: true,
                });
            }

            // Enregistrer le salon dans la base de données
            await ChatbotConfig.findOneAndUpdate(
                { serverId: interaction.guild.id },
                { serverId: interaction.guild.id, channelId: salon.id },
                { upsert: true }
            );

            return interaction.reply(`✅ Chatbot activé dans le salon <#${salon.id}>.`);
        } else {
            // Désactiver le chatbot
            await ChatbotConfig.findOneAndDelete({ serverId: interaction.guild.id });
            return interaction.reply("❌ Chatbot désactivé pour ce serveur.");
        }
    },
};
