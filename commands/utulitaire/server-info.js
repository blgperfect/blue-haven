const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Affiche des informations détaillées sur le serveur.'),
    async execute(interaction) {
        const guild = interaction.guild;

        // Récupération des données du serveur
        const owner = await guild.fetchOwner(); // Propriétaire du serveur
        const memberCount = guild.memberCount; // Nombre total de membres
        const rolesCount = guild.roles.cache.size; // Nombre de rôles
        const channelsCount = guild.channels.cache.size; // Nombre de salons
        const createdAt = `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`; // Date de création
        const boosts = guild.premiumSubscriptionCount || 0; // Nombre de boosts
        const boostTier = guild.premiumTier ? `Niveau ${guild.premiumTier}` : 'Aucun';
        const emojisCount = guild.emojis.cache.size; // Nombre d'emojis
        const verificationLevel = guild.verificationLevel; // Niveau de vérification

        // Création de l'embed
        const embed = new EmbedBuilder()
            .setTitle(`🌐 Informations sur le serveur : ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 })) // Icône du serveur
            .addFields(
                { name: '👑 Propriétaire', value: `${owner.user.tag}`, inline: true },
                { name: '📅 Créé le', value: `${createdAt}`, inline: true },
                { name: '👥 Membres', value: `${memberCount}`, inline: true },
                { name: '📜 Rôles', value: `${rolesCount}`, inline: true },
                { name: '💬 Salons', value: `${channelsCount}`, inline: true },
                { name: '✨ Boosts', value: `${boosts} (${boostTier})`, inline: true },
                { name: '😊 Emojis', value: `${emojisCount}`, inline: true },
                { name: '🔒 Niveau de vérification', value: `${verificationLevel}`, inline: true }
            )
            .setFooter({ text: `ID du serveur : ${guild.id}` })
            .setColor('#1E90FF') // Couleur de l'embed (bleu lumineux)
            .setTimestamp();

        // Réponse avec l'embed
        await interaction.reply({ embeds: [embed] });
    },
};
