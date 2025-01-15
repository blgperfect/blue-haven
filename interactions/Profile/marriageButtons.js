const { Client, ButtonInteraction, EmbedBuilder } = require('discord.js');
const Couple = require('../../database/models/Couple');

/**
 * @param {Client} client
 * @param {ButtonInteraction} interaction
 */
module.exports = async (_client, interaction) => {
    if (!interaction.isButton()) return;

    const { customId, user, message, guild } = interaction;

    switch (customId) {
        case 'accept-marriage': {
            const user1 = message.mentions.users.first();
            const user2 = user;

            // Vérification si les utilisateurs sont déjà mariés
            const existingCouple = await Couple.findOne({
                $or: [
                    { user1Id: user1.id, user2Id: user.id },
                    { user1Id: user.id, user2Id: user1.id },
                ],
            });

            if (existingCouple) {
                return interaction.reply({
                    content: "❌ Vous êtes déjà mariés avec cette personne.",
                    ephemeral: true,
                });
            }

            // Enregistrement du couple
            await Couple.create({
                user1Id: user1.id,
                user2Id: user2.id,
                serverId: guild.id,
            });

            const embed = new EmbedBuilder()
                .setTitle("🎉 Félicitations !")
                .setDescription(`${user1} et ${user2} sont maintenant mariés ! 💍`)
                .setColor('Green');

            await message.edit({ embeds: [embed], components: [] });
            return interaction.reply({
                content: "✅ Le mariage a été enregistré avec succès.",
                ephemeral: true,
            });
        }

        case 'decline-marriage': {
            return interaction.reply({
                content: "💔 La demande en mariage a été refusée.",
                ephemeral: true,
            });
        }

        default:
            console.warn(`⚠️ Bouton inconnu : ${customId}`);
            return interaction.reply({
                content: "❌ Action non reconnue.",
                ephemeral: true,
            });
    }
};
