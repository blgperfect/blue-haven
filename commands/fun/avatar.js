const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Affiche l\'avatar d\'un utilisateur avec style.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('L\'utilisateur dont vous voulez voir l\'avatar.')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user; // Cible l'utilisateur mentionné ou celui qui exécute la commande
        const avatarURL = target.displayAvatarURL({ dynamic: true, size: 1024 }); // Avatar avec meilleure qualité

        // Création de l'embed
        const embed = new EmbedBuilder()
            .setTitle(`Avatar de ${target.username}`)
            .setDescription(`[Télécharger l'avatar](<${avatarURL}>)`) // Lien pour télécharger l'avatar
            .setImage(avatarURL) // Ajoute l'avatar en image
            .setColor('#1E90FF') // Couleur bleue
            .setFooter({ text: `Demandé par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        // Réponse avec l'embed
        await interaction.reply({ embeds: [embed] });
    },
};
