const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Couple = require('../../database/models/Couple');
const Like = require('../../database/models/LikeData');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('marriage-profile')
        .setDescription('Voir votre profil de mariage.'),
    async execute(interaction) {
        const userId = interaction.user.id;

        // Chercher si l'utilisateur fait partie d'un couple
        const couple = await Couple.findOne({
            $or: [
                { user1Id: userId },
                { user2Id: userId },
            ]
        });

        const embed = new EmbedBuilder()
            .setTitle("💍 Votre profil de mariage")
            .setColor('Green')
            .setFooter({
                text: `Profil demandé par ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp();

        if (couple) {
            // L'utilisateur est dans un couple
            const partnerId = couple.user1Id === userId ? couple.user2Id : couple.user1Id;

            // Calculer les likes du couple
            const coupleId = `${couple.user1Id}-${couple.user2Id}`;
            const likesCount = await Like.countDocuments({ receiverId: coupleId, type: 'couple' });

            embed.addFields(
                { name: "Vous", value: `<@${userId}>`, inline: true },
                { name: "Partenaire", value: `<@${partnerId}>`, inline: true },
                { name: "Date de mariage", value: couple.marriageDate.toDateString(), inline: false },
                { name: "Nombre de likes", value: `${likesCount}`, inline: true },
                { name: "Lieu", value: couple.customizations.location || "Non spécifié", inline: true },
                { name: "Message personnalisé", value: couple.customizations.message || "Non spécifié", inline: false },
            );
        } else {
            // Calculer les likes pour le célibataire
            const likesCount = await Like.countDocuments({ receiverId: userId, type: 'celib' });

            embed.setDescription("❌ Vous n'êtes actuellement pas dans un couple.");
            embed.addFields(
                { name: "Statut", value: "Célibataire", inline: true },
                { name: "Likes reçus", value: `${likesCount}`, inline: true },
            );
        }

        // Répondre avec le profil
        interaction.reply({ embeds: [embed] });
    },
};
