const { SlashCommandBuilder, PermissionsBitField, AttachmentBuilder } = require('discord.js');
const { parse } = require('json2csv');
const Application = require('../../database/models/applyData.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('export')
        .setDescription('Exporte les candidatures en CSV.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption(option =>
            option
                .setName('filter')
                .setDescription('Filtrer par statut (toutes, acceptées, rejetées, en attente).')
                .setRequired(false)
                .addChoices(
                    { name: 'Toutes', value: 'all' },
                    { name: 'En attente', value: 'pending' },
                    { name: 'Acceptées', value: 'accepted' },
                    { name: 'Rejetées', value: 'rejected' }
                )
        )
        .addBooleanOption(option =>
            option
                .setName('specific')
                .setDescription('Voulez-vous exporter une candidature spécifique ?')
                .setRequired(false)
        ),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const filter = interaction.options.getString('filter') || 'all';
        const specific = interaction.options.getBoolean('specific') || false;

        const query = { guildId };
        if (filter === 'pending') query.status = 'en attente';
        if (filter === 'accepted') query.status = 'acceptée';
        if (filter === 'rejetée') query.status = 'rejetée';

        const applications = await Application.find(query);

        if (applications.length === 0) {
            return interaction.reply({
                content: `❌ Aucune candidature trouvée avec le filtre sélectionné (${filter}).`,
                ephemeral: true,
            });
        }

        if (specific) {
            const menu = new StringSelectMenuBuilder()
                .setCustomId('select-application')
                .setPlaceholder('Choisissez une candidature à exporter')
                .addOptions(
                    applications.map(app => ({
                        label: `${app.username} - ${app.status}`,
                        description: `Soumise le ${new Date(app.createdAt).toLocaleString()}`,
                        value: app._id.toString(),
                    }))
                );

            const menuRow = new ActionRowBuilder().addComponents(menu);

            await interaction.reply({
                content: '🎯 Sélectionnez une candidature à exporter :',
                components: [menuRow],
                ephemeral: true,
            });

            const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'select-application') {
                    const applicationId = i.values[0];
                    const application = await Application.findById(applicationId);

                    const data = [{
                        username: application.username,
                        status: application.status,
                        reason: application.reason || 'Non spécifiée',
                        answers: application.answers.join('; '),
                        createdAt: new Date(application.createdAt).toLocaleString(),
                    }];

                    const csv = parse(data, { fields: ['username', 'status', 'reason', 'answers', 'createdAt'] });
                    const attachment = new AttachmentBuilder(Buffer.from(csv, 'utf-8'), { name: 'candidature.csv' });

                    await i.reply({
                        content: '📂 Voici l\'export de la candidature sélectionnée :',
                        files: [attachment],
                        ephemeral: true,
                    });
                }
            });
            return;
        }

        const data = applications.map(app => ({
            username: app.username,
            status: app.status,
            reason: app.reason || 'Non spécifiée',
            answers: app.answers.join('; '),
            createdAt: new Date(app.createdAt).toLocaleString(),
        }));

        const csv = parse(data, { fields: ['username', 'status', 'reason', 'answers', 'createdAt'] });
        const attachment = new AttachmentBuilder(Buffer.from(csv, 'utf-8'), { name: 'candidatures.csv' });

        await interaction.reply({
            content: `📂 Voici l'export des candidatures (${filter}) :`,
            files: [attachment],
            ephemeral: false,
        });
    },
};
