// like.js
const { SlashCommandBuilder } = require('discord.js');
const Like = require('../../database/models/LikeData');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('like')
        .setDescription('Aimer un couple ou un célibataire.')
        .addSubcommand(subcommand =>
            subcommand.setName('couple')
                .setDescription('Liker un couple.')
                .addUserOption(option =>
                    option.setName('user1')
                        .setDescription('Premier membre du couple.')
                        .setRequired(true))
                .addUserOption(option =>
                    option.setName('user2')
                        .setDescription('Deuxième membre du couple.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('celib')
                .setDescription('Liker un célibataire.')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('La personne à liker.')
                        .setRequired(true))),
    async execute(interaction) {
        const userId = interaction.user.id;
        const type = interaction.options.getSubcommand();
        const targetId = type === 'celib' 
            ? interaction.options.getUser('user').id 
            : `${interaction.options.getUser('user1').id}-${interaction.options.getUser('user2').id}`;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Vérification si un like pour la même personne/couple a déjà été envoyé aujourd'hui
        const existingLike = await Like.findOne({
            giverId: userId,
            receiverId: targetId,
            type,
            date: { $gte: today },
        });

        if (existingLike) {
            return interaction.reply({
                content: `❌ Vous avez déjà liké ${type === 'celib' ? `<@${targetId}>` : `le couple`} aujourd'hui.`,
                ephemeral: true
            });
        }

        // Enregistrement du like
        await Like.create({ giverId: userId, receiverId: targetId, type });

        interaction.reply({
            content: `✅ Vous avez liké ${type === 'celib' ? `<@${targetId}>` : `le couple`} avec succès !`,
            ephemeral: true
        });
    },
};
