const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Fait une annonce sophistiquée avec des options personnalisées.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Le contenu principal de l\'annonce.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Titre de l\'annonce.')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Choisissez une couleur pour l\'embed.')
                .addChoices(
                    { name: 'Bleu', value: '#1E90FF' },
                    { name: 'Rouge', value: '#FF0000' },
                    { name: 'Vert', value: '#00FF00' },
                    { name: 'Jaune', value: '#FFFF00' },
                    { name: 'Violet', value: '#800080' },
                    { name: 'Orange', value: '#FFA500' }
                )
        )
        .addStringOption(option =>
            option.setName('footer')
                .setDescription('Texte à afficher dans le pied de page.')
                .setRequired(false)
        )
        .addAttachmentOption(option =>
            option.setName('image')
                .setDescription('Ajoutez une image à l\'annonce.')
                .setRequired(false)
        ),
    async execute(interaction) {
        // Vérifier les permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: "❌ Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        // Récupération des options
        const message = interaction.options.getString('message');
        const title = interaction.options.getString('title') || '📢 Annonce';
        const color = interaction.options.getString('color') || '#1E90FF'; // Bleu par défaut
        const footer = interaction.options.getString('footer') || `Annonce faite par ${interaction.user.tag}`;
        const image = interaction.options.getAttachment('image'); // Récupération de l'image attachée

        // Création de l'embed
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(message)
            .setColor(color)
            .setFooter({ text: footer, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        if (image) {
            embed.setImage(image.url); // Ajoute l'image attachée si disponible
        }

        // Envoyer l'embed dans le salon actuel
        try {
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'annonce :', error);
            await interaction.reply({ content: "❌ Une erreur est survenue lors de l'envoi de l'annonce.", ephemeral: true });
        }
    },
};
