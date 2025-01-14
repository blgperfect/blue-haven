const { SlashCommandBuilder } = require('discord.js');
const Maintenance = require('../../database/models/maintenance');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('maintenance')
        .setDescription('Gère le mode maintenance du bot.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('activer')
                .setDescription('Active le mode maintenance (seul le développeur peut utiliser les commandes).'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('desactiver')
                .setDescription('Désactive le mode maintenance (tous les utilisateurs peuvent utiliser les commandes).')),
    async execute(interaction) {
        const devId = '808313178739048489'; // Votre ID

        // Vérifie si l'utilisateur est le développeur
        if (interaction.user.id !== devId) {
            return interaction.reply({
                content: '❌ Seul le développeur peut exécuter cette commande.',
                ephemeral: true,
            });
        }

        const subcommand = interaction.options.getSubcommand();

        try {
            let maintenanceDoc = await Maintenance.findById('global');

            // Si le document n'existe pas, le créer
            if (!maintenanceDoc) {
                maintenanceDoc = new Maintenance({ _id: 'global', maintenance: false });
            }

            if (subcommand === 'activer') {
                if (maintenanceDoc.maintenance) {
                    return interaction.reply({
                        content: '⚠️ Le mode maintenance est déjà activé.',
                        ephemeral: true,
                    });
                }

                maintenanceDoc.maintenance = true;
                await maintenanceDoc.save();

                return interaction.reply('✅ Le mode maintenance a été activé. Toutes les commandes sont désactivées sauf pour le développeur.');
            }

            if (subcommand === 'desactiver') {
                if (!maintenanceDoc.maintenance) {
                    return interaction.reply({
                        content: '⚠️ Le mode maintenance est déjà désactivé.',
                        ephemeral: true,
                    });
                }

                maintenanceDoc.maintenance = false;
                await maintenanceDoc.save();

                return interaction.reply('✅ Le mode maintenance a été désactivé. Toutes les commandes sont désormais accessibles.');
            }
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: '❌ Une erreur est survenue lors de la gestion du mode maintenance.',
                ephemeral: true,
            });
        }
    },
};
