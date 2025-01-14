const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const ChannelManager = require('../../utils/channelManager');
const RoleManager = require('../../utils/roleManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Gérer le système de profil')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('activate')
        .setDescription('Active le système de profil pour ce serveur')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('desactivate')
        .setDescription('Désactive le système de profil pour ce serveur')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;

    if (!guild) {
      return interaction.reply({
        content: '❌ Cette commande doit être exécutée dans un serveur.',
        ephemeral: true,
      });
    }

    if (subcommand === 'activate') {
      const confirmEmbed = new EmbedBuilder()
        .setTitle('Activation du système de profil')
        .setDescription(
          'Êtes-vous sûr de vouloir activer le système de profil ?\n\n' +
            'Cela va créer les salons et les rôles nécessaires pour ce serveur.\n\n' +
            'Appuyez sur **Oui** pour continuer ou sur **Non** pour annuler.'
        )
        .setColor('#00FF00');

      const confirmRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('profile-activate-confirm')
          .setLabel('Oui')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('profile-activate-cancel')
          .setLabel('Non')
          .setStyle(ButtonStyle.Danger)
      );

      return interaction.reply({
        embeds: [confirmEmbed],
        components: [confirmRow],
        ephemeral: true,
      });
    }

    if (subcommand === 'desactivate') {
      const confirmEmbed = new EmbedBuilder()
        .setTitle('Désactivation du système de profil')
        .setDescription(
          'Êtes-vous sûr de vouloir désactiver le système de profil ?\n\n' +
            'Cela va supprimer les salons et les rôles associés au système de profil, mais les données seront conservées pour une éventuelle réactivation.\n\n' +
            'Appuyez sur **Oui** pour continuer ou sur **Non** pour annuler.'
        )
        .setColor('#FF0000');

      const confirmRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('profile-desactivate-confirm')
          .setLabel('Oui')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('profile-desactivate-cancel')
          .setLabel('Non')
          .setStyle(ButtonStyle.Secondary)
      );

      return interaction.reply({
        embeds: [confirmEmbed],
        components: [confirmRow],
        ephemeral: true,
      });
    }
  },
};
