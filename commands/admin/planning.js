const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ComponentType,
    PermissionsBitField,
} = require('discord.js');
const PlanningEvent = require('../../database/models/planningEvent');
const PlanningConfig = require('../../database/models/planningConfig');
const { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = require('date-fns');
const { fr, enUS, enCA } = require('date-fns/locale');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('planning')
        .setDescription('Gérez le planning des événements.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Ajoutez un nouvel événement au planning.')
                .addStringOption(option =>
                    option.setName('nom').setDescription('Nom de l\'événement.').setRequired(true))
                .addStringOption(option =>
                    option.setName('date').setDescription('Date de l\'événement (YYYY-MM-DD).').setRequired(true))
                .addStringOption(option =>
                    option.setName('heure').setDescription('Heure de l\'événement (HH:mm).').setRequired(true))
                .addStringOption(option =>
                    option.setName('description').setDescription('Description de l\'événement.').setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('Affiche les événements prévus dans un calendrier.')
                .addStringOption(option =>
                    option.setName('plage')
                        .setDescription('Jour, semaine ou mois.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Jour', value: 'day' },
                            { name: 'Semaine', value: 'week' },
                            { name: 'Mois', value: 'month' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Supprimez un événement à partir d\'une liste interactive.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Configurez les préférences du serveur.')
                .addChannelOption(option =>
                    option.setName('canal').setDescription('Canal obligatoire pour publier les annonces.').setRequired(true))
                .addStringOption(option =>
                    option.setName('fuseau_horaire')
                        .setDescription('Fuseau horaire (France, Etats-Unis, Canada).')
                        .setRequired(true)
                        .addChoices(
                            { name: 'France', value: 'fr' },
                            { name: 'États-Unis', value: 'enUS' },
                            { name: 'Canada', value: 'enCA' }
                        ))),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        const config = await PlanningConfig.findOne({ guildId }) || {};
        const locale = config.timezone === 'enUS' ? enUS : config.timezone === 'enCA' ? enCA : fr;

        // Restrict non-admins to 'view' subcommand only
        if (
            subcommand !== 'view' &&
            !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)
        ) {
            return interaction.reply({
                content: '❌ Vous devez être administrateur pour utiliser cette commande.',
                ephemeral: true,
            });
        }

        try {
            switch (subcommand) {
                case 'add': {
                    const name = interaction.options.getString('nom');
                    const date = interaction.options.getString('date');
                    const time = interaction.options.getString('heure');
                    const description = interaction.options.getString('description');
                    const eventDate = new Date(`${date}T${time}:00`);

                    if (isNaN(eventDate)) {
                        return interaction.reply({ content: '❌ Date ou heure invalide.', ephemeral: true });
                    }

                    const event = new PlanningEvent({
                        guildId,
                        name,
                        date: eventDate,
                        description,
                    });

                    await event.save();

                    return interaction.reply({ content: `✅ Événement "${name}" ajouté avec succès !`, ephemeral: true });
                }

                case 'view': {
                    const plage = interaction.options.getString('plage');
                    const now = new Date();
                    let startDate, endDate;

                    if (plage === 'day') {
                        startDate = now;
                        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                    } else if (plage === 'week') {
                        startDate = startOfWeek(now, { locale });
                        endDate = endOfWeek(now, { locale });
                    } else if (plage === 'month') {
                        startDate = startOfMonth(now);
                        endDate = endOfMonth(now);
                    }

                    const events = await PlanningEvent.find({
                        guildId,
                        date: { $gte: startDate, $lte: endDate },
                    }).sort({ date: 1 });

                    if (events.length === 0) {
                        return interaction.reply({
                            content: '📅 Aucun événement trouvé pour cette période.',
                            ephemeral: true,
                        });
                    }

                    const eventsList = events.map(event =>
                        `📅 **${event.name}** - ${format(event.date, 'Pp', { locale })}`
                    ).join('\n');

                    return interaction.reply({
                        content: `Voici les événements prévus :\n${eventsList}`,
                        ephemeral: true,
                    });
                }

                case 'delete': {
                    const events = await PlanningEvent.find({ guildId }).sort({ date: 1 });

                    if (events.length === 0) {
                        return interaction.reply({ content: '❌ Aucun événement à supprimer.', ephemeral: true });
                    }

                    const options = events.map(event => ({
                        label: event.name,
                        description: `Prévu pour le ${format(event.date, 'Pp', { locale })}`,
                        value: event._id.toString(),
                    }));

                    const menu = new StringSelectMenuBuilder()
                        .setCustomId('delete-event')
                        .setPlaceholder('Sélectionnez un événement à supprimer')
                        .addOptions(options);

                    const actionRow = new ActionRowBuilder().addComponents(menu);

                    const embed = new EmbedBuilder()
                        .setTitle('📋 Supprimer un événement')
                        .setDescription('Sélectionnez un événement à supprimer dans le menu déroulant.')
                        .setColor('#ff0000');

                    const message = await interaction.reply({
                        embeds: [embed],
                        components: [actionRow],
                        ephemeral: true,
                    });

                    const collector = message.createMessageComponentCollector({
                        componentType: ComponentType.StringSelect,
                        time: 300000,
                    });

                    collector.on('collect', async menuInteraction => {
                        const eventId = menuInteraction.values[0];
                        const event = await PlanningEvent.findByIdAndDelete(eventId);

                        if (!event) {
                            return menuInteraction.update({
                                content: '❌ L\'événement n\'existe pas ou a déjà été supprimé.',
                                components: [],
                                embeds: [],
                            });
                        }

                        return menuInteraction.update({
                            content: `✅ L'événement "${event.name}" a été supprimé.`,
                            components: [],
                            embeds: [],
                        });
                    });

                    collector.on('end', async () => {
                        const disabledRow = new ActionRowBuilder().addComponents(menu.setDisabled(true));
                        await message.edit({ components: [disabledRow] });
                    });
                }
            }
        } catch (error) {
            console.error('❌ Erreur :', error);
            return interaction.reply({
                content: '❌ Une erreur est survenue.',
                ephemeral: true,
            });
        }
    },
};
