const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Like = require('../../database/models/LikeData');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Voir les classements des couples ou célibataires.')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Classement à afficher.')
                .setRequired(true)
                .addChoices(
                    { name: 'Couples', value: 'couple' },
                    { name: 'Célibataires', value: 'celib' }
                )),
    async execute(interaction) {
        const type = interaction.options.getString('type');
        const likes = await Like.aggregate([
            { $match: { type } },
            { $group: { _id: '$receiverId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        const embed = new EmbedBuilder()
            .setTitle(type === 'couple' ? "💖 Classement des couples" : "💖 Classement des célibataires")
            .setDescription(
                likes.map((like, index) => `**#${index + 1}** <@${like._id}> - ${like.count} likes`).join('\n') || "Aucun like pour le moment."
            )
            .setColor('Purple');

        interaction.reply({ embeds: [embed] });
    },
};
