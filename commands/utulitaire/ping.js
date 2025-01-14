const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Vérifie si le bot est en ligne et affiche la latence.'),
    async execute(interaction) {
        await interaction.reply(`🏓 Pong ! Latence : ${Date.now() - interaction.createdTimestamp}ms`);
    },
};
