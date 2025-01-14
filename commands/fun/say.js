const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Le bot répète ce que vous dites.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Le message que le bot doit dire.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const message = interaction.options.getString('message');
        await interaction.reply(message); // Le bot répète le message
    },
};
