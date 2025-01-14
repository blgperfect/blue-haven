const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rule')
        .setDescription('Affiche les règles du serveur.'),
    async execute(interaction) {
        await interaction.reply(
            "︶꒦꒷♡꒷꒦︶ **Règlements du serveur !** ︶꒦꒷♡꒷꒦︶\n\n" +
            "<a:78525bulletpointids:1326763140788260924> **1. Respect avant tout :**\n" +
            "<:19387blueheart:1326763058067931156> Soyez courtois avec tous les membres.\n\n" +
            "<a:78525bulletpointids:1326763140788260924> **2. Pas de harcèlement :**\n" +
            "<:7107jinxheartblue:1326762971795292182> Les discours haineux et l'intimidation ne sont pas tolérés.\n\n" +
            "<a:78525bulletpointids:1326763140788260924> **3. Contenu approprié :**\n" +
            "<:19387blueheart:1326763058067931156>  Publiez uniquement des contenus conformes aux règles de Discord.\n\n" +
            "<a:78525bulletpointids:1326763140788260924> **4. Pas de spam :**\n" +
            "<:2708verified:1326762947829174323> Pas de messages répétitifs ou de publicité sans permission.\n\n" +
            "<a:78525bulletpointids:1326763140788260924> **5. Amusez-vous bien !** 🎉"
        );
    },
};
