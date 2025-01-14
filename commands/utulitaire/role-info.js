const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-info')
        .setDescription('Affiche les informations d\'un rôle.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Rôle pour lequel afficher les informations.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const role = interaction.options.getRole('role');

        const embed = new EmbedBuilder()
            .setTitle(`🔷 Informations sur le rôle : ${role.name}`)
            .setColor(role.color || '#1E90FF')
            .addFields(
                { name: 'ID', value: `${role.id}`, inline: true },
                { name: 'Nombre de membres', value: `${role.members.size}`, inline: true },
                { name: 'Position', value: `${role.position}`, inline: true }
            )
            .setFooter({ text: `Rôle ID : ${role.id}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
