const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Application = require('../../database/models/applications');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Vérifiez le statut de vos candidatures.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const userId = interaction.user.id;

        // Récupérer les candidatures de l'utilisateur
        const applications = await Application.find({ guildId, userId });

        if (applications.length === 0) {
            return interaction.reply({
                content: '❌ Vous n\'avez soumis aucune candidature.',
                ephemeral: true,
            });
        }

        // Trier les candidatures par statut
        const pendingApplications = applications.filter(app => app.status === 'en attente');
        const acceptedApplications = applications.filter(app => app.status === 'acceptée');
        const rejectedApplications = applications.filter(app => app.status === 'rejetée');

        // Construire le menu de sélection
        const createMenu = () => {
            const options = [];

            if (pendingApplications.length > 0) {
                options.push({
                    label: `En attente (${pendingApplications.length})`,
                    description: 'Voir vos candidatures en attente.',
                    value: 'pending',
                });
            }

            if (acceptedApplications.length > 0) {
                options.push({
                    label: `Acceptées (${acceptedApplications.length})`,
                    description: 'Voir vos candidatures acceptées.',
                    value: 'accepted',
                });
            }

            if (rejectedApplications.length > 0) {
                options.push({
                    label: `Rejetées (${rejectedApplications.length})`,
                    description: 'Voir vos candidatures rejetées.',
                    value: 'rejected',
                });
            }

            return new StringSelectMenuBuilder()
                .setCustomId('select-status')
                .setPlaceholder('Choisissez une catégorie de candidatures')
                .addOptions(options);
        };

        const menuRow = new ActionRowBuilder().addComponents(createMenu());

        // Envoyer le menu
        const message = await interaction.reply({
            content: '🎯 Sélectionnez une catégorie de candidatures pour voir les détails :',
            components: [menuRow],
            ephemeral: true,
        });

        // Gérer les interactions avec le menu
        const collector = message.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'select-status') {
                const category = i.values[0];
                let selectedApplications = [];

                if (category === 'pending') selectedApplications = pendingApplications;
                if (category === 'accepted') selectedApplications = acceptedApplications;
                if (category === 'rejected') selectedApplications = rejectedApplications;

                // Construire les embeds pour chaque candidature
                const embeds = selectedApplications.map(app => {
                    const embed = new EmbedBuilder()
                        .setTitle(`Candidature soumise le ${new Date(app.createdAt).toLocaleString()}`)
                        .setColor(app.status === 'acceptée' ? 0x00FF00 : app.status === 'rejetée' ? 0xFF0000 : 3447003)
                        .addFields(
                            app.answers.map((answer, index) => ({
                                name: `Question ${index + 1}`,
                                value: answer || 'Non renseigné',
                            }))
                        )
                        .setTimestamp();

                    if (app.status === 'acceptée') {
                        embed.addFields({ name: 'Statut', value: '✅ Acceptée' });
                    } else if (app.status === 'rejetée') {
                        embed.addFields(
                            { name: 'Statut', value: '❌ Rejetée' },
                            { name: 'Raison', value: app.reason || 'Non spécifiée' }
                        );
                    } else {
                        embed.addFields({ name: 'Statut', value: '⏳ En attente' });
                    }

                    return embed;
                });

                await i.reply({
                    content: `📋 Voici vos candidatures ${category === 'pending' ? 'en attente' : category === 'accepted' ? 'acceptées' : 'rejetées'} :`,
                    embeds,
                    ephemeral: true,
                });
            }
        });
    },
};
