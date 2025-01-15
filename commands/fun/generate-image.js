const { SlashCommandBuilder } = require('discord.js');
const { generateImage } = require('../../utils/chatgpt');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('generate-image')
        .setDescription('Génère une image basée sur une description.')
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Description de l’image que vous voulez générer.')
                .setRequired(true)),
    async execute(interaction) {
        const description = interaction.options.getString('description');

        await interaction.deferReply(); // Donne plus de temps pour traiter la requête

        const imageUrl = await generateImage(description);
        if (imageUrl) {
            await interaction.editReply({
                content: `Voici votre image générée pour : **${description}**`,
                files: [{ attachment: imageUrl, name: 'generated-image.png' }],
            });
        } else {
            await interaction.editReply("❌ Une erreur est survenue lors de la génération de l'image.");
        }
    },
};
