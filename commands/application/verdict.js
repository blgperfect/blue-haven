const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');
const Application = require('../../database/models/applyData.js');
const Settings = require('../../database/models/settings');
const { ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verdict')
        .setDescription('Gérez les candidatures en attente.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: '❌ Vous n’avez pas les permissions nécessaires pour utiliser cette commande.',
                ephemeral: true,
            });
        }

        const guildId = interaction.guild.id;

        const settings = await Settings.findOne({ guildId });
        if (!settings || !settings.isEnabled) {
            return interaction.reply({
                content: '❌ Le système de candidature est désactivé. Veuillez l\'activer avec `/application toggle`.',
                ephemeral: true,
            });
        }

        const applications = await Application.find({ guildId, status: 'en attente' });

        if (applications.length === 0) {
            return interaction.reply({
                content: '✅ Aucune candidature en attente.',
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
                    label: `${app.username} - ${new Date(app.createdAt).toLocaleString()}`,
                    description: "Cliquez pour voir la candidature.",
                    value: app._id.toString(),
                }));

            return new StringSelectMenuBuilder()
                .setCustomId('select-application')
                .setPlaceholder('Sélectionnez une candidature')
                .addOptions(options);
        };

        const createEmbed = () => ({
            title: `📋 Candidatures en attente (Page ${currentPage}/${totalPages})`,
            color: 3447003, // Bleu
            description: 'Sélectionnez une candidature pour voir les détails.',
        });

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
                    .setColor(3447003) // Bleu ciel
                    .addFields(
                        settings.questions.map((q, index) => ({
                            name: q,
                            value: application.answers[index] || 'Non renseigné',
                        }))
                    )
                    .setTimestamp();

                const actionRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`accept-${application._id}`)
                        .setLabel('Accepter')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`reject-${application._id}`)
                        .setLabel('Rejeter')
                        .setStyle(ButtonStyle.Danger)
                );

                const replyMessage = await i.reply({
                    embeds: [embed],
                    components: [actionRow],
                    fetchReply: true,
                });

                const actionCollector = replyMessage.createMessageComponentCollector({ time: 60000 });
                actionCollector.on('collect', async (actionInteraction) => {
                    if (actionInteraction.customId.startsWith('accept-')) {
                        const applicationId = actionInteraction.customId.split('-')[1];
                        const application = await Application.findById(applicationId);

                        if (application) {
                            application.status = 'acceptée';
                            await application.save();

                            const updatedEmbed = EmbedBuilder.from(replyMessage.embeds[0])
                                .setColor(0x00FF00) // Vert pour approuvé
                                .addFields(
                                    { name: 'Statut', value: '✅ Approuvé' },
                                    { name: 'Approuvé par', value: actionInteraction.user.tag }
                                );

                            await replyMessage.edit({
                                embeds: [updatedEmbed],
                                components: [],
                            });

                            const user = await interaction.client.users.fetch(application.userId);
                            await user.send("🎉 Félicitations, votre candidature pour le rôle a été acceptée !");

                            if (!actionInteraction.replied && !actionInteraction.deferred) {
                                await actionInteraction.reply({
                                    content: `✅ La candidature de **${application.username}** a été acceptée.`,
                                    ephemeral: true,
                                });
                            }
                        }
                    } else if (actionInteraction.customId.startsWith('reject-')) {
                        const applicationId = actionInteraction.customId.split('-')[1];

                        const modal = new ModalBuilder()
                            .setCustomId(`reject-reason-${applicationId}`)
                            .setTitle('Raison du rejet')
                            .addComponents(
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('reason')
                                        .setLabel('Pourquoi rejetez-vous cette candidature ?')
                                        .setStyle(TextInputStyle.Paragraph)
                                        .setRequired(true)
                                )
                            );

                        await actionInteraction.showModal(modal);

                        const modalSubmit = await actionInteraction.awaitModalSubmit({
                            filter: (modalInteraction) => modalInteraction.customId === `reject-reason-${applicationId}` && modalInteraction.user.id === actionInteraction.user.id,
                            time: 60000,
                        }).catch(err => {
                            console.error('Erreur lors de la soumission du modal :', err);
                            return null;
                        });

                        if (!modalSubmit) {
                            return actionInteraction.followUp({
                                content: '❌ Le temps pour fournir une raison a expiré.',
                                ephemeral: true,
                            });
                        }

                        const reason = modalSubmit.fields.getTextInputValue('reason');
                        const application = await Application.findById(applicationId);

                        if (application) {
                            application.status = 'rejetée';
                            application.reason = reason;
                            await application.save();

                            const updatedEmbed = EmbedBuilder.from(replyMessage.embeds[0])
                                .setColor(0xFF0000) // Rouge pour rejeté
                                .addFields(
                                    { name: 'Statut', value: '❌ Rejeté' },
                                    { name: 'Raison', value: reason },
                                    { name: 'Rejeté par', value: modalSubmit.user.tag }
                                );

                            await replyMessage.edit({
                                embeds: [updatedEmbed],
                                components: [],
                            });

                            const user = await interaction.client.users.fetch(application.userId);
                            await user.send(`❌ Malheureusement, votre candidature pour le rôle a été rejetée. Raison : **${reason}**`);

                            await modalSubmit.reply({
                                content: `❌ La candidature de **${application.username}** a été rejetée avec la raison suivante :
**${reason}**`,
                                ephemeral: true,
                            });
                        }
                    }
                });
            }

            await i.update({
                embeds: [createEmbed()],
                components: [menuRow, buttonRow],
            });
        });
    },
};
