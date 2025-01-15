// accept-mariage.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Couple = require('../../database/models/Couple');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('accept-marriage')
        .setDescription('Accepter une demande en mariage.'),
    async execute(interaction) {
        const user1 = interaction.message.mentions.users.first();
        const user2 = interaction.user;

        const existingCouple = await Couple.findOne({ 
            $or: [
                { user1Id: user1.id, user2Id: user2.id },
                { user1Id: user2.id, user2Id: user1.id },
            ]
        });

        if (existingCouple) {
            return interaction.reply({ content: "❌ Vous êtes déjà mariés avec cette personne.", ephemeral: true });
        }

        await Couple.create({
            user1Id: user1.id,
            user2Id: user2.id,
            serverId: interaction.guild.id,
        });

        const embed = new EmbedBuilder()
            .setTitle("🎉 Félicitations !")
            .setDescription(`${user1} et ${user2} sont maintenant mariés ! 💍`)
            .setColor('Green');

        await interaction.message.edit({ embeds: [embed], components: [] });
        interaction.reply({ content: "✅ Le mariage a été enregistré avec succès.", ephemeral: true });
    },
};
