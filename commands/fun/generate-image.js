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

        // Messages dynamiques pendant la réflexion
        const waitingMessages = [
            "🖌️ Je prépare quelque chose d'incroyable...",
            "🎨 Je peins votre image, cela prend un moment...",
            "🖍️ Je dessine avec soin pour créer votre image parfaite...",
        ];
        const randomMessage = waitingMessages[Math.floor(Math.random() * waitingMessages.length)];

        // Envoi d'un message temporaire
        const thinkingMessage = await interaction.reply({
            content: randomMessage,
            fetchReply: true,
        });

        // Génération de l'image
        const imageUrl = await generateImage(description);

        if (imageUrl) {
            // Modification du message initial pour afficher l'image
            await interaction.editReply({
                content: `✅ Voici votre image générée pour : **${description}**`,
                files: [{ attachment: imageUrl, name: 'generated-image.png' }],
            });
        } else {
            // Modification en cas d'erreur
            await interaction.editReply("❌ Une erreur est survenue lors de la génération de l'image.");
        }
    },
};
