const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ComponentType,
} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Affiche la liste des commandes disponibles par catégorie.'),
    async execute(interaction) {
        const commandsPath = path.join(__dirname, '..', '..', 'commands');
        const categories = fs.readdirSync(commandsPath).filter(category =>
            fs.statSync(path.join(commandsPath, category)).isDirectory()
        );

        // Générer les options du menu déroulant
        const selectMenuOptions = categories.map(category => ({
            label: category.charAt(0).toUpperCase() + category.slice(1),
            value: category,
            description: `Voir les commandes de la catégorie ${category}.`,
        }));

        // Créer un menu déroulant
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help_menu')
            .setPlaceholder('Choisissez une catégorie...')
            .addOptions(selectMenuOptions);

        const actionRow = new ActionRowBuilder().addComponents(selectMenu);

        // Embed initial
        const embed = new EmbedBuilder()
            .setTitle('📚 Menu d\'aide')
            .setDescription('Sélectionnez une catégorie dans le menu déroulant pour afficher ses commandes.')
            .setColor('#1E90FF')
            .setFooter({
                text: `Demandé par ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        const message = await interaction.reply({
            embeds: [embed],
            components: [actionRow],
            ephemeral: true,
        });

        // Gestion des interactions avec le menu déroulant
        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.StringSelect, // Type correct pour le menu déroulant
            time: 300000, // Actif pendant 5 minutes
        });

        collector.on('collect', async (menuInteraction) => {
            const selectedCategory = menuInteraction.values[0];
            const categoryPath = path.join(commandsPath, selectedCategory);
            const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

            const commandsList = files.map(file => {
                const command = require(path.join(categoryPath, file));
                if (command.data?.name && command.data.description) {
                    return `\`/${command.data.name}\` : ${command.data.description}`;
                }
                return null;
            }).filter(Boolean);

            const categoryEmbed = new EmbedBuilder()
                .setTitle(`📂 Commandes : ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`)
                .setDescription(commandsList.join('\n') || 'Aucune commande disponible.')
                .setColor('#1E90FF')
                .setFooter({
                    text: `Demandé par ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp();

            await menuInteraction.update({ embeds: [categoryEmbed], components: [actionRow] });
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                const disabledRow = new ActionRowBuilder().addComponents(
                    selectMenu.setDisabled(true)
                );
                await message.edit({ components: [disabledRow] });
                await interaction.followUp({ content: '⏰ Le menu a expiré.', ephemeral: true });
            }
        });
    },
};
