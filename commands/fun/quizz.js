const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const Score = require('../../database/models/scores'); // Utilisation de MongoDB pour les scores

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quizz')
        .setDescription('Lance un quiz amusant avec des points.')
        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('Choisissez une catégorie (par exemple : Science, Histoire).')
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName('difficulty')
                .setDescription('Choisissez une difficulté (facile, moyen, difficile).')
                .setRequired(false)
        ),
    async execute(interaction) {
        const category = interaction.options.getString('category');
        const difficulty = interaction.options.getString('difficulty');

        // Charger les questions depuis le fichier JSON
        const questionsPath = path.join(__dirname, '../../data/questions.json');
        const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

        // Filtrer les questions
        const filteredQuestions = questions.filter(q => {
            return (!category || q.category === category) &&
                   (!difficulty || q.difficulty === difficulty);
        });

        if (filteredQuestions.length === 0) {
            return interaction.reply({
                content: `❌ Aucun quiz disponible pour la catégorie "${category || 'Toutes'}" et la difficulté "${difficulty || 'Toutes'}".`,
                ephemeral: true,
            });
        }

        // Sélectionner une question aléatoire
        const question = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];

        const embed = new EmbedBuilder()
            .setTitle(`🎲 Quiz : ${question.category}`)
            .setDescription(`**${question.question}**\n\nRépondez avec le numéro correspondant :\n` +
                question.answers.map((ans, idx) => `**${idx + 1}.** ${ans}`).join('\n'))
            .setColor('#1E90FF')
            .setFooter({ text: `Difficulté : ${question.difficulty}` });

        await interaction.reply({ embeds: [embed] });

        const filter = (msg) => msg.author.id === interaction.user.id && !isNaN(msg.content) && Number(msg.content) > 0 && Number(msg.content) <= question.answers.length;

        const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });
        let answered = false;

        collector.on('collect', async (msg) => {
            collector.stop();
            const userAnswer = Number(msg.content) - 1;
            const correctAnswer = question.answers.indexOf(question.correct);

            if (userAnswer === correctAnswer) {
                answered = true;
                await msg.reply(`✅ Bravo ! La bonne réponse était **${question.correct}**. +10 points !`);
                await updateScore(interaction.user.id, interaction.user.username, 10);
            } else {
                answered = true;
                await msg.reply(`❌ Mauvaise réponse ! La bonne réponse était **${question.correct}**. -5 points.`);
                await updateScore(interaction.user.id, interaction.user.username, -5);
            }
        });

        collector.on('end', async (_, reason) => {
            if (!answered && reason === 'time') {
                await interaction.followUp({
                    content: `⏰ Temps écoulé ! La bonne réponse était **${question.correct}**.`,
                });
                await updateScore(interaction.user.id, interaction.user.username, -5);
            }
        });
    },
};

// Fonction pour mettre à jour le score dans MongoDB
async function updateScore(userId, username, points) {
    let score = await Score.findOne({ userId });
    if (!score) {
        score = new Score({ userId, username, score: 0 });
    }
    score.score += points;
    await score.save();
}
