const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Lance un dé et affiche un résultat.')
        .addIntegerOption(option =>
            option.setName('faces')
                .setDescription('Le nombre de faces du dé.')
                .setRequired(false)
        ),
    async execute(interaction) {
        const faces = interaction.options.getInteger('faces') || 6; // Par défaut, un dé à 6 faces
        const result = Math.floor(Math.random() * faces) + 1;
        await interaction.reply(`🎲 Tu as lancé un dé à ${faces} faces et obtenu : **${result}** !`);
    },
};
