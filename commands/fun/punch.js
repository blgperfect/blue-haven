const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('punch')
        .setDescription('Envoie un coup de poing à un utilisateur mentionné ! 👊')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur que vous souhaitez frapper.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const utilisateur = interaction.options.getUser('utilisateur');

        // Vérifie si l'utilisateur est le même que l'auteur
        if (utilisateur.id === interaction.user.id) {
            return interaction.reply({
                content: '👊 Tu ne peux pas te frapper toi-même... mais je t\'envoie un punch virtuel !',
                ephemeral: true,
            });
        }

        // API Giphy pour rechercher des GIFs
        const apiKey = 'fyRG7twHYUeuWHuFBhXm3OUXQ0PePsN3';
        const url = `https://api.giphy.com/v1/gifs/search?q=punch+anime&api_key=${apiKey}&limit=100`;

        try {
            // Importation dynamique de `node-fetch`
            const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
            const response = await fetch(url);
            const json = await response.json();

            // Vérifie si des GIFs ont été retournés
            if (!json.data || json.data.length === 0) {
                return interaction.reply({
                    content: '❌ Aucun GIF de punch trouvé. Essaie plus tard pour plus d\'action !',
                    ephemeral: true,
                });
            }

            // Sélectionne un GIF aléatoire
            const randomIndex = Math.floor(Math.random() * json.data.length);
            const gifUrl = json.data[randomIndex].images.original.url;

            // Messages dynamiques selon l'auteur et la cible
            const messages = [
                `👊 **${interaction.user.username}** frappe violemment **${utilisateur.username}** ! 💥`,
                `💥 **${interaction.user.username}** envoie un énorme coup de poing à **${utilisateur.username}** ! 💪`,
                `✨ Un punch furieux de **${interaction.user.username}** pour **${utilisateur.username}** ! ✨`,
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];

            // Création de l'embed
            const embed = new EmbedBuilder()
                .setTitle('💥 Un coup de poing intense ! 💥')
                .setDescription(randomMessage)
                .setImage(gifUrl)
                .setColor('#FF4500') // Couleur orange pour un effet d'action
                .setFooter({
                    text: `Demandé par ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp();

            // Réponse avec l'embed
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors de la récupération du GIF :', error);
            await interaction.reply({
                content: '❌ Une erreur est survenue lors de la récupération du GIF. Essaie plus tard !',
                ephemeral: true,
            });
        }
    },
};
