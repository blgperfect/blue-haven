const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Obtiens un mème aléatoire.'),
    async execute(interaction) {
        try {
            // Import dynamique de node-fetch
            const fetch = (await import('node-fetch')).default;

            // Appel à l'API imgflip
            const response = await fetch('https://api.imgflip.com/get_memes');
            const data = await response.json();

            if (!data.success) {
                return interaction.reply('❌ Impossible de récupérer un mème pour le moment. Réessaie plus tard.');
            }

            // Sélectionner un mème aléatoire
            const memes = data.data.memes;
            const randomMeme = memes[Math.floor(Math.random() * memes.length)];

            // Répondre avec le mème
            await interaction.reply({ content: "🎉 Voici un mème pour toi :", files: [randomMeme.url] });
        } catch (error) {
            console.error('Erreur lors de la récupération du mème :', error);
            await interaction.reply('❌ Une erreur est survenue en essayant d\'obtenir un mème.');
        }
    },
};
