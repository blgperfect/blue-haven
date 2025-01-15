const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Couple = require('../../database/models/Couple');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('couple-stats')
        .setDescription('Voir les statistiques de votre couple.'),
    async execute(interaction) {
        const userId = interaction.user.id;

        const couple = await Couple.findOne({
            $or: [
                { user1Id: userId },
                { user2Id: userId },
            ]
        });

        if (!couple) {
            return interaction.reply({ content: "❌ Vous n'êtes pas marié pour voir des statistiques.", ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle("💍 Statistiques du couple")
            .addFields(
                { name: "Partenaire 1", value: `<@${couple.user1Id}>`, inline: true },
                { name: "Partenaire 2", value: `<@${couple.user2Id}>`, inline: true },
                { name: "Date de mariage", value: couple.marriageDate.toDateString(), inline: false },
                { name: "Nombre de likes", value: `${couple.likes}`, inline: true },
                { name: "Lieu", value: couple.customizations.location || "Non spécifié", inline: true },
                { name: "Message", value: couple.customizations.message || "Non spécifié", inline: false },
            )
            .setColor('Green');

        interaction.reply({ embeds: [embed] });
    },
};
