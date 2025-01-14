const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coms') // Nom de la commande
    .setDescription('Affiche la liste des commandes et sous-commandes'),

  async execute(interaction) {
    const commandsDir = path.resolve(__dirname, '..'); // Accéder au dossier parent "commands"
    const commandFiles = [];

    // Récupérer toutes les commandes et sous-dossiers
    function loadCommands(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
          loadCommands(fullPath); // Charger récursivement les sous-dossiers
        } else if (file.endsWith('.js')) {
          commandFiles.push(fullPath);
        }
      }
    }

    loadCommands(commandsDir);

    const commandsList = [];
    for (const file of commandFiles) {
      const command = require(file);
      if (command.data) {
        const commandInfo = {
          name: `/${command.data.name}`,
          subcommands: [],
        };

        // Vérifier les sous-commandes
        if (command.data.options) {
          for (const option of command.data.options) {
            if (option.type === 1) { // 1 = Sous-commande
              commandInfo.subcommands.push(`/${command.data.name} ${option.name}`);
            } else if (option.type === 2) { // 2 = Groupe de sous-commandes
              for (const sub of option.options || []) {
                commandInfo.subcommands.push(`/${command.data.name} ${option.name} ${sub.name}`);
              }
            }
          }
        }

        commandsList.push(commandInfo);
      }
    }

    // Construire une réponse texte avec seulement les noms des commandes
    let responseText = '**Liste des commandes :**\n\n';
    for (const command of commandsList) {
      responseText += `${command.name}\n`;
      for (const sub of command.subcommands) {
        responseText += `  - ${sub}\n`;
      }
    }

    // Envoyer la réponse dans le canal (pas ephemeral)
    await interaction.reply({ content: responseText, ephemeral: false });
  },
};
