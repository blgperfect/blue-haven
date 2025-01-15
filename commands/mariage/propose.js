const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('propose')
        .setDescription('Envoyer une demande en mariage à un utilisateur.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('L\'utilisateur à qui envoyer la demande.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message personnalisé.')
                .setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const message = interaction.options.getString('message') || "Veux-tu te marier avec moi ?";

        if (target.id === interaction.user.id) {
            return interaction.reply({ content: "❌ Vous ne pouvez pas vous marier avec vous-même !", ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle("💍 Demande en mariage")
            .setDescription(`${interaction.user} a demandé ${target} en mariage !\n\n**Message :** ${message}`)
            .setColor('Purple');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('accept-marriage').setLabel('Accepter 💖').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('decline-marriage').setLabel('Refuser ❌').setStyle(ButtonStyle.Danger)
            );

        const sentMessage = await interaction.reply({
            content: `${target}`,
            embeds: [embed],
            components: [row],
            fetchReply: true,
        });

        // Délai pour supprimer le message si aucune réponse n'est donnée
        const timeLimit = 5 * 60 * 1000; // 5 minutes en millisecondes
        const collector = sentMessage.createMessageComponentCollector({
            time: timeLimit,
        });

        collector.on('end', async (collected) => {
            if (collected.size === 0) {
                await sentMessage.delete().catch(() => {});
                await interaction.followUp({
                    content: "⏳ La demande en mariage a expiré car il n'y a eu aucune réponse.",
                    ephemeral: true,
                });
            }
        });
    },
};
