const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-mariage')
        .setDescription('Configurer les salons pour le système de mariage.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Salon pour les annonces de mariage.')
                .setRequired(false)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        if (channel) {
            interaction.reply({ content: `✅ Salon de mariage configuré : ${channel}.` });
        } else {
            interaction.reply({ content: "❌ Aucun salon spécifié.", ephemeral: true });
        }
    },
};
