const { SlashCommandBuilder } = require('discord.js');
const Couple = require('../../database/models/Couple');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wedding-customize')
        .setDescription('Personnaliser votre mariage.')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('Lieu fictif pour le mariage.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message ou vœux personnalisés.')
                .setRequired(false)),
    async execute(interaction) {
        const userId = interaction.user.id;
        const location = interaction.options.getString('location');
        const message = interaction.options.getString('message');

        const couple = await Couple.findOne({
            $or: [
                { user1Id: userId },
                { user2Id: userId },
            ]
        });

        if (!couple) {
            return interaction.reply({ content: "❌ Vous n'êtes pas marié pour personnaliser un mariage.", ephemeral: true });
        }

        if (location) couple.customizations.location = location;
        if (message) couple.customizations.message = message;
        await couple.save();

        interaction.reply({ content: "✅ Mariage personnalisé avec succès !" });
    },
};
