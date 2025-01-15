require('dotenv').config();
const fs = require('fs');
const chalk = require('chalk');
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const connectDB = require('./database/connect');
const Maintenance = require('./database/models/maintenance');
const welcomeEvent = require('./welcome.js');
const commands = require('./commands');
const likeManager = require('./utils/likeManager');
const getAllFiles = require("./utils/getAllFiles")
const path = require("path")
const messageCreateHandler = require('./events/messageCreate'); // Chemin vers messageCreate.js

// Initialisation du client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

// Efface le terminal et affiche un message de démarrage
console.clear();
console.log(chalk.blue.bold(`System >> Initialisation...`));

client.once('ready', async () => {
    console.log(chalk.green(`✅ Connecté en tant que ${client.user.tag}`));

    // Connexion à MongoDB
    console.log(chalk.blue(`🔗 Connexion à MongoDB...`));
    await connectDB();
    console.log(chalk.green(`✅ Connexion à MongoDB réussie !`));

    // Définir l'activité du bot
    client.user.setPresence({
        activities: [{ name: 'Blue Haven', type: 3 }], // 3 = Écoute (Listening to)
        status: 'online',
    });
    console.log(chalk.yellow(`🎧 Activité définie : "Écoute Blue Haven"`));

    // Déploiement des commandes globales
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        console.log(chalk.yellow(`🚀 Déploiement des commandes globales...`));
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands.map(command => command.data.toJSON()) }
        );
        console.log(chalk.green(`✅ Commandes globales déployées avec succès !`));
    } catch (error) {
        console.error(chalk.red(`❌ Erreur lors du déploiement des commandes :`, error));
    }
});

// Middleware pour gérer la maintenance
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const devId = '808313178739048489'; // Votre ID de développeur
    const command = commands.find(cmd => cmd.data.name === interaction.commandName);

    if (!command) return;

    try {
        const maintenanceDoc = await Maintenance.findById('global');
        const isMaintenanceActive = maintenanceDoc?.maintenance || false;

        if (isMaintenanceActive && interaction.user.id !== devId) {
            return interaction.reply({
                content: '⚠️ Le bot est actuellement en mode maintenance. Veuillez réessayer plus tard.',
                ephemeral: true,
            });
        }

        console.log(chalk.blue(`➡️ Exécution de la commande : ${interaction.commandName}`));
        
        // Check if interaction has already been acknowledged
        if (!interaction.replied && !interaction.deferred) {
            await command.execute(interaction);
        }
    } catch (error) {
        console.error(chalk.red(`❌ Erreur lors de l'exécution de la commande "${interaction.commandName}" :`, error));
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'Erreur lors de l\'exécution de la commande.', ephemeral: true });
        }
    }
});


// Gestion des boutons

client.on('interactionCreate', async (interaction) => {
        const interactionFolders = getAllFiles(path.join(__dirname, "./interactions"), "folders")

    for (const subFolder of interactionFolders) {
        const interactionFiles = getAllFiles(subFolder, "files", true)
    
        for (const eventFile of interactionFiles) {
            try {
                const eventFunction = require(eventFile);
                // const eventFunction = eventModule.default;

                await eventFunction(client, interaction);
            } catch (error) {
                console.error(error);
            }
        }
    }
});

// Gestion des réactions (likes)
client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;
    await likeManager.handleLikeReaction(reaction, user);
});

// Gestion des événements de bienvenue
client.on(welcomeEvent.name, (...args) => welcomeEvent.execute(...args));

//gestions du chatbot
client.on('messageCreate', (message) => messageCreateHandler.execute(message));


// Gestion des erreurs
process.on('unhandledRejection', (error) => {
    console.error(chalk.red(`❌ Rejet non géré :`, error));
});

process.on('warning', (warn) => {
    console.warn(chalk.yellow(`⚠️ Avertissement :`, warn));
});

// Connexion du bot
client.login(process.env.DISCORD_TOKEN);
console.log(chalk.cyan.bold(`🔑 Tentative de connexion au bot...`));
