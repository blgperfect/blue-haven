const { SlashCommandBuilder } = require('discord.js');
const Couple = require('../../database/models/Couple');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('manage-couple')
        .setDescription('Gérer les couples pour les administrateurs.')
        .addSubcommand(subcommand =>
            subcommand.setName('list')
                .setDescription('Afficher tous les couples.'))
        .addSubcommand(subcommand =>
            subcommand.setName('delete')
                .setDescription('Supprimer un couple.')
                .addUserOption(option =>
                    option.setName('user1')
                        .setDescription('Premier membre du couple.')
                        .setRequired(true))
                .addUserOption(option =>
                    option.setName('user2')
                        .setDescription('Deuxième membre du couple.')
                        .setRequired(true))),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'list') {
            const couples = await Couple.find();
            const list = couples.map(c => `<@${c.user1Id}> ❤️ <@${c.user2Id}>`).join('\n') || "Aucun couple enregistré.";
            interaction.reply({ content: `📜 **Liste des couples :**\n${list}` });
        } else if (interaction.options.getSubcommand() === 'delete') {
            const user1Id = interaction.options.getUser('user1').id;
            const user2Id = interaction.options.getUser('user2').id;

            const couple = await Couple.findOne({
                $or: [
                    { user1Id, user2Id },
                    { user1Id: user2Id, user2Id: user1Id },
                ]
            });

            if (!couple) {
                return interaction.reply({ content: "❌ Aucun couple trouvé avec ces membres.", ephemeral: true });
            }

            await couple.deleteOne();
            interaction.reply({ content: `✅ Couple entre <@${user1Id}> et <@${user2Id}> supprimé.` });
        }
    },
};
