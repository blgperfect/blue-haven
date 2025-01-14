const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder, PermissionsBitField } = require('discord.js');
const Application = require('../../database/models/applications');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('history')
        .setDescription('Affiche l\'historique des candidatures.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption(option =>
            option
                .setName('filter')
                .setDescription('Filtrer par statut (toutes, acceptées, rejetées).')
                .setRequired(false)
                .addChoices(
                    { name: 'Toutes', value: 'all' },
                    { name: 'Acceptées', value: 'accepted' },
                    { name: 'Rejetées', value: 'rejected' }
                )
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: '❌ Vous n’avez pas les permissions nécessaires pour utiliser cette commande.',
                ephemeral: true,
            });
        }

        const guildId = interaction.guild.id;
        const filter = interaction.options.getString('filter') || 'all';

        const query = { guildId };
        if (filter === 'accepted') query.status = 'acceptée';
        if (filter === 'rejected') query.status = 'rejetée';

        const applications = await Application.find(query).sort({ createdAt: -1 });

        if (applications.length === 0) {
            return interaction.reply({
                content: `✅ Aucun historique de candidatures ${filter !== 'all' ? `(${filter})` : ''}.`,
                ephemeral: true,
            });
        }

        const pageSize = 10;
        const totalPages = Math.ceil(applications.length / pageSize);
        let currentPage = 1;

        const createMenu = (page) => {
            const options = applications
                .slice((page - 1) * pageSize, page * pageSize)
                .map(app => ({
                    label: `${app.username} (${app.status})`,
                    description: `Date : ${new Date(app.createdAt).toLocaleString()}`,
                    value: app._id.toString(),
                }));

            return new StringSelectMenuBuilder()
                .setCustomId('select-application')
                .setPlaceholder('Sélectionnez une candidature')
                .addOptions(options);
        };

        const createEmbed = () => {
            const description = `Affichage des candidatures (${filter}): Page ${currentPage}/${totalPages}`;
            return new EmbedBuilder()
                .setTitle('📜 Historique des candidatures')
                .setDescription(description)
                .setColor(3447003) // Bleu
                .setTimestamp();
        };

        const menuRow = new ActionRowBuilder().addComponents(createMenu(currentPage));
        const buttonRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('prev-page')
                .setLabel('⬅️ Précédent')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === 1),
            new ButtonBuilder()
                .setCustomId('next-page')
                .setLabel('➡️ Suivant')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === totalPages)
        );

        const message = await interaction.reply({
            embeds: [createEmbed()],
            components: [menuRow, buttonRow],
            fetchReply: true,
        });

        const collector = message.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'prev-page') {
                currentPage--;
            } else if (i.customId === 'next-page') {
                currentPage++;
            } else if (i.customId === 'select-application') {
                const applicationId = i.values[0];
                const application = await Application.findById(applicationId);

                const embed = new EmbedBuilder()
                    .setTitle(`Candidature de ${application.username}`)
                    .setColor(application.status === 'acceptée' ? 0x00FF00 : application.status === 'rejetée' ? 0xFF0000 : 3447003)
                    .addFields(
                        { name: 'Statut', value: application.status },
                        { name: 'Raison (si rejetée)', value: application.reason || 'Non spécifiée' },
                        ...application.answers.map((answer, index) => ({
                            name: `Question ${index + 1}`,
                            value: answer || 'Non renseigné',
                        }))
                    )
                    .setTimestamp();

                return i.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            }

            await i.update({
                embeds: [createEmbed()],
                components: [menuRow, buttonRow],
            });
        });
    },
};
