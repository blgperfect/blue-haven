const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd, // Événement déclenché lorsqu'un membre rejoint
    execute(member) {
        // Message de bienvenue
        const welcomeEmbed = new EmbedBuilder()
            .setTitle('🎉 Bienvenue sur le serveur ! 🎉')
            .setDescription(`Salut **${member.user.username}**, nous sommes ravis de t'accueillir dans **${member.guild.name}** ! 😊`)
            .addFields(
                { name: '🌟 Ce que tu peux faire :', value: '✔️ Lire les [règles](#).\n✔️ Te présenter dans le canal dédié.\n✔️ Profiter de la communauté !' },
                { name: '📢 Besoin d’aide ?', value: 'N’hésite pas à contacter un modérateur.' }
            )
            .setColor('#1E90FF') // Couleur bleu
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 })) // Avatar de l'utilisateur
            .setFooter({ text: `ID utilisateur : ${member.user.id}`, iconURL: member.guild.iconURL({ dynamic: true }) })
            .setTimestamp();

        // Envoi du message privé
        member.send({ embeds: [welcomeEmbed] }).catch((error) => {
            console.error(`Impossible d'envoyer un message privé à ${member.user.tag}:`, error);
        });
    },
};