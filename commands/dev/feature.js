const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feature')
        .setDescription('Affiche les fonctionnalités en cours de développement.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🚀 Fonctionnalités à venir')
            .setDescription(
                'Voici un aperçu des fonctionnalités passionnantes actuellement en cours de développement :'
            )
            .setColor('#00AAFF')
            .addFields(
                { name: '💡 Système d\'application complet', value: 'Gestion avancée des candidatures et des rôles.' },
                { name: '☠️ Système de mort pour les inactifs', value: 'Les membres inactifs seront marqués comme morts !' },
                { name: '🧑‍🤝‍🧑 Système de profil pour les rencontres', value: 'Créez des profils pour mieux interagir et vous connecter avec les autres.' },
                { name: '🎉 Système d\'événements', value: 'Organisez et participez à des événements communautaires incroyables.' }
            )
            .setFooter({
                text: '✨ Restez à l\'écoute pour plus d\'informations !',
                iconURL: 'https://i.imgur.com/AfFp7pu.png', // Exemple d'icône
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
