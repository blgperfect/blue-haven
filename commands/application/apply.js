
const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Settings = require('../../database/models/settings');
const Application = require('../../database/models/applyData.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('apply')
        .setDescription('Soumettez une candidature pour un rôle.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;

        // Charger les paramètres
        const settings = await Settings.findOne({ guildId });
        if (!settings || !settings.isEnabled) {
            return interaction.reply({
                content: '❌ Le système de candidature est désactivé. Veuillez contacter un administrateur.',
                ephemeral: true,
            });
        }

        const validRoles = settings.roles
            .map(roleId => interaction.guild.roles.cache.get(roleId))
            .filter(Boolean);

        if (validRoles.length === 0) {
            return interaction.reply({
                content: '❌ Aucun rôle valide n\'est configuré pour les candidatures. Contactez un administrateur.',
                ephemeral: true,
            });
        }

        const menu = new StringSelectMenuBuilder()
            .setCustomId('role-select')
            .setPlaceholder('Choisissez un rôle')
            .addOptions(validRoles.map(role => ({
                label: role.name,
                value: role.id,
            })));

        const menuRow = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({
            content: '🎯 Sélectionnez le rôle pour lequel vous souhaitez postuler :',
            components: [menuRow],
            ephemeral: true,
        });

        const filter = i => i.customId === 'role-select' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async menuInteraction => {
            const selectedRoleId = menuInteraction.values[0];
            const selectedRole = interaction.guild.roles.cache.get(selectedRoleId);

            if (!settings.questions || settings.questions.length === 0) {
                return menuInteraction.reply({
                    content: '❌ Aucune question configurée pour les candidatures. Contactez un administrateur.',
                    ephemeral: true,
                });
            }

            const modal = new ModalBuilder()
                .setCustomId('application-modal')
                .setTitle(`Candidature pour : ${selectedRole.name}`);

            settings.questions.forEach((question, index) => {
                modal.addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId(`question-${index}`)
                            .setLabel(question)
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true)
                    )
                );
            });

            await menuInteraction.showModal(modal);

            const submitted = await menuInteraction.awaitModalSubmit({
                filter: i => i.customId === 'application-modal' && i.user.id === interaction.user.id,
                time: 60000,
            }).catch(err => {
                console.error('Modal submission timed out:', err);
                return null;
            });

            if (!submitted) return;

            const answers = settings.questions.map((_, index) => submitted.fields.getTextInputValue(`question-${index}`));
            const application = await Application.create({
                guildId,
                userId: interaction.user.id,
                username: interaction.user.tag,
                answers,
                status: 'en attente',
            });

            const applicationChannel = interaction.guild.channels.cache.get(settings.applicationChannelId);
            if (applicationChannel) {
                await applicationChannel.send({
                    content: `Nouvelle candidature de **${interaction.user.tag}** pour le rôle <@&${selectedRoleId}> :`,
                    embeds: [
                        {
                            title: 'Candidature reçue',
                            color: 0x87CEEB,
                            fields: settings.questions.map((q, i) => ({
                                name: q,
                                value: answers[i] || 'Non renseigné',
                            })),
                            timestamp: new Date(),
                        },
                    ],
                });
            }

            await submitted.reply({ content: '✅ Votre candidature a été soumise avec succès.', ephemeral: true });
        });
    },
};
