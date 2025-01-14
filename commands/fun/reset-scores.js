const { SlashCommandBuilder } = require('discord.js');
const Score = require('../../database/models/scores');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset-scores')
        .setDescription('Réinitialise les scores de tous les joueurs (admin seulement).'),
    async execute(interaction) {
        if (!interaction.member.permissions.has('Administrator')) {
            return interaction.reply({
                content: "❌ Vous n'avez pas la permission de réinitialiser les scores.",
                ephemeral: true,
            });
        }

        await Score.deleteMany({});
        await interaction.reply({ content: '✅ Tous les scores ont été réinitialisés avec succès.' });
    },
};
