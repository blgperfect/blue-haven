const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Crée un sondage interactif avec une durée personnalisée.')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('La question du sondage.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('option1')
                .setDescription('Première option.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('option2')
                .setDescription('Seconde option.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Durée du sondage en minutes.')
                .setRequired(false)
        ),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const option1 = interaction.options.getString('option1');
        const option2 = interaction.options.getString('option2');
        const duration = interaction.options.getInteger('duration') || 10;

        let votesOption1 = 0;
        let votesOption2 = 0;

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('vote_option1').setLabel(option1).setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('vote_option2').setLabel(option2).setStyle(ButtonStyle.Primary)
        );

        const embed = new EmbedBuilder()
            .setTitle('📊 Sondage')
            .setDescription(`**${question}**`)
            .addFields(
                { name: option1, value: `Votes : 0`, inline: true },
                { name: option2, value: `Votes : 0`, inline: true }
            )
            .setColor('#1E90FF');

        const pollMessage = await interaction.reply({ embeds: [embed], components: [buttons] });

        const collector = pollMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: duration * 60 * 1000,
        });

        collector.on('collect', async (i) => {
            if (i.customId === 'vote_option1') votesOption1++;
            else if (i.customId === 'vote_option2') votesOption2++;

            embed.setFields(
                { name: option1, value: `Votes : ${votesOption1}`, inline: true },
                { name: option2, value: `Votes : ${votesOption2}`, inline: true }
            );

            await pollMessage.edit({ embeds: [embed] });
            await i.reply({ content: '✅ Votre vote a été pris en compte.', ephemeral: true });
        });

        collector.on('end', () => {
            embed.setColor('#FFD700').setFooter({ text: 'Sondage terminé.' });
            pollMessage.edit({ embeds: [embed], components: [] });
        });
    },
};
