const { SlashCommandBuilder } = require('discord.js');
const Canvas = require('canvas');
const Score = require('../../database/models/scores'); // Utilise MongoDB pour gérer les scores

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quizz-rank')
        .setDescription('Affiche le classement des meilleurs joueurs.'),
    async execute(interaction) {
        // Récupérer les scores depuis MongoDB, triés par ordre décroissant
        const scores = await Score.find().sort({ score: -1 }).limit(10);

        if (scores.length === 0) {
            return interaction.reply({
                content: '❌ Aucun score enregistré pour le moment.',
                ephemeral: true,
            });
        }

        // Préparer Canvas pour le classement
        const canvas = Canvas.createCanvas(800, 600);
        const ctx = canvas.getContext('2d');

        // Fond du canvas
        ctx.fillStyle = '#2C2F33';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Titre
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('🏆 Classement des meilleurs joueurs', 50, 50);

        // Ajouter les scores au canvas
        ctx.font = '28px Arial';
        scores.forEach((score, idx) => {
            const position = `${idx + 1}.`;
            const username = `${score.username}`;
            const points = `${score.score} points`;

            ctx.fillStyle = idx === 0 ? '#FFD700' : '#FFFFFF'; // Or pour le premier
            ctx.fillText(position, 50, 100 + idx * 50);
            ctx.fillText(username, 100, 100 + idx * 50);
            ctx.fillText(points, 600, 100 + idx * 50);
        });

        // Convertir le canvas en image
        const attachment = canvas.toBuffer();

        // Répondre avec l'image du classement
        await interaction.reply({
            files: [{ attachment, name: 'leaderboard.png' }],
        });
    },
};
