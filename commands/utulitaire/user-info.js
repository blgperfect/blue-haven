const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Affiche des informations détaillées sur un utilisateur.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('L\'utilisateur dont vous voulez les informations.')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user; // Si aucun utilisateur spécifié, cible celui qui exécute la commande
        const member = interaction.guild.members.cache.get(target.id);

        // Création de l'embed
        const embed = new EmbedBuilder()
            .setColor('#1E90FF') // Bleu lumineux
            .setTitle(`📄 Informations sur ${target.username}`)
            .setThumbnail(target.displayAvatarURL({ dynamic: true })) // Avatar de l'utilisateur
            .addFields(
                { name: 'Pseudo complet', value: `${target.tag}`, inline: true },
                { name: 'ID', value: `${target.id}`, inline: true },
                { name: 'Rôle principal', value: `${member.roles.highest.name}`, inline: true },
                { name: 'Compte créé le', value: `<t:${Math.floor(target.createdTimestamp / 1000)}:F>`, inline: true },
                { name: 'Rejoint le serveur le', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true }
            )
            .setFooter({ text: `Demandé par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
