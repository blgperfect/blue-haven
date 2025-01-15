const { SlashCommandBuilder } = require('discord.js');
const Couple = require('../../database/models/Couple');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('divorce')
        .setDescription('Mettre fin à un mariage.')
        .addUserOption(option =>
            option.setName('partner')
                .setDescription('Partenaire à divorcer.')
                .setRequired(true)),
    async execute(interaction) {
        const partnerId = interaction.options.getUser('partner').id;
        const userId = interaction.user.id;

        const couple = await Couple.findOne({
            $or: [
                { user1Id: userId, user2Id: partnerId },
                { user1Id: partnerId, user2Id: userId },
            ]
        });

        if (!couple) {
            return interaction.reply({ content: "❌ Vous n'êtes pas marié à cette personne.", ephemeral: true });
        }

        await couple.deleteOne();
        interaction.reply({ content: "💔 Divorce réussi. Vous êtes maintenant célibataire." });
    },
};
