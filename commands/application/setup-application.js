const { SlashCommandBuilder, PermissionsBitField, ChannelType, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Settings = require('../../database/models/settings');
const Application = require('../../database/models/applyData.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('application')
        .setDescription('Configure le système de candidature.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        // Sous-commandes existantes
        .addSubcommand(subcommand =>
            subcommand
                .setName('toggle')
                .setDescription('Active ou désactive le système de candidature.')
                .addBooleanOption(option =>
                    option.setName('enabled')
                        .setDescription('Activer ou désactiver le système.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reset')
                .setDescription('Réinitialise les paramètres ou les candidatures.')
                .addStringOption(option =>
                    option.setName('scope')
                        .setDescription('Réinitialisation des paramètres ou des candidatures.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Paramètres', value: 'settings' },
                            { name: 'Candidatures', value: 'applications' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove-role')
                .setDescription('Supprime un rôle autorisé dans les candidatures.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Rôle à supprimer.')
                        .setRequired(true)
                )
        )
        // Nouvelles sous-commandes ajoutées
        .addSubcommand(subcommand =>
            subcommand
                .setName('setchannel')
                .setDescription('Définit le salon où seront envoyées les candidatures.')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Le salon à utiliser pour les candidatures.')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setroles')
                .setDescription('Définit les rôles pour lesquels les utilisateurs peuvent postuler.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Rôle que les utilisateurs peuvent postuler.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('addquestions')
                .setDescription('Ajoute une question à poser dans les candidatures.')
                .addStringOption(option =>
                    option.setName('question')
                        .setDescription('Texte de la question.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('removequestion')
                .setDescription('Supprime une question de la liste.')
                .addIntegerOption(option =>
                    option.setName('index')
                        .setDescription('Index de la question à supprimer (1 pour la première question).')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('settings')
                .setDescription('Affiche la configuration actuelle du système.')
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: '❌ Vous n’avez pas les permissions nécessaires pour utiliser cette commande.',
                ephemeral: true,
            });
        }

        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        let settings = await Settings.findOne({ guildId });
        if (!settings) {
            settings = new Settings({ guildId });
            await settings.save();
        }

        switch (subcommand) {
            case 'toggle': {
                const enabled = interaction.options.getBoolean('enabled');
                settings.isEnabled = enabled;
                await settings.save();
                return interaction.reply({
                    content: `✅ Le système de candidature est maintenant ${enabled ? 'activé' : 'désactivé'}.`,
                    ephemeral: true,
                });
            }

            case 'reset': {
                const scope = interaction.options.getString('scope');

                if (scope === 'settings') {
                    settings.roles = [];
                    settings.questions = [];
                    settings.applicationChannelId = null;
                    settings.isEnabled = false;
                    await settings.save();

                    return interaction.reply({
                        content: '✅ Les paramètres du système de candidature ont été réinitialisés.',
                        ephemeral: true,
                    });
                } else if (scope === 'applications') {
                    await Application.deleteMany({ guildId });
                    return interaction.reply({
                        content: '✅ Toutes les candidatures ont été supprimées.',
                        ephemeral: true,
                    });
                }
                break;
            }

            case 'remove-role': {
                const role = interaction.options.getRole('role');
                if (!settings.roles.includes(role.id)) {
                    return interaction.reply({
                        content: `❌ Le rôle ${role} n’est pas configuré pour les candidatures.`,
                        ephemeral: true,
                    });
                }

                settings.roles = settings.roles.filter(r => r !== role.id);
                await settings.save();

                return interaction.reply({
                    content: `✅ Le rôle ${role} a été retiré avec succès.`,
                    ephemeral: true,
                });
            }

            case 'setchannel': {
                const channel = interaction.options.getChannel('channel');
                settings.applicationChannelId = channel.id;
                await settings.save();
                return interaction.reply({
                    content: `✅ Le salon des candidatures a été défini sur ${channel}.`,
                    ephemeral: true,
                });
            }

            case 'setroles': {
                const role = interaction.options.getRole('role');
                if (!settings.roles.includes(role.id)) {
                    settings.roles.push(role.id);
                    await settings.save();
                    return interaction.reply({
                        content: `✅ Le rôle ${role} a été ajouté à la liste des rôles pour les candidatures.`,
                        ephemeral: true,
                    });
                } else {
                    return interaction.reply({
                        content: `⚠️ Le rôle ${role} est déjà configuré pour les candidatures.`,
                        ephemeral: true,
                    });
                }
            }

            case 'addquestions': {
                const question = interaction.options.getString('question');
                settings.questions.push(question);
                await settings.save();
                return interaction.reply({
                    content: `✅ La question "${question}" a été ajoutée avec succès.`,
                    ephemeral: true,
                });
            }

            case 'removequestion': {
                const index = interaction.options.getInteger('index') - 1;
                if (index < 0 || index >= settings.questions.length) {
                    return interaction.reply({
                        content: '❌ Index invalide. Veuillez fournir un numéro de question valide.',
                        ephemeral: true,
                    });
                }

                const removedQuestion = settings.questions.splice(index, 1);
                await settings.save();
                return interaction.reply({
                    content: `✅ La question "${removedQuestion}" a été supprimée avec succès.`,
                    ephemeral: true,
                });
            }

            case 'settings': {
                const roles = settings.roles.map(id => `<@&${id}>`).join('\n') || 'Aucun rôle configuré.';
                const questions = settings.questions.length
                    ? settings.questions.map((q, i) => `**${i + 1}.** ${q}`).join('\n')
                    : 'Aucune question configurée.';
                const channel = settings.applicationChannelId
                    ? `<#${settings.applicationChannelId}>`
                    : 'Aucun salon configuré.';
                const status = settings.isEnabled ? 'Activé' : 'Désactivé';

                const embed = {
                    title: '⚙️ Configuration actuelle du système de candidature',
                    color: 3447003, // Bleu
                    fields: [
                        { name: 'Statut', value: status, inline: true },
                        { name: 'Salon des candidatures', value: channel, inline: true },
                        { name: 'Rôles autorisés', value: roles },
                        { name: 'Questions configurées', value: questions },
                    ],
                    timestamp: new Date(),
                };

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    },
};
