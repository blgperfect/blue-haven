const {
  StringSelectMenuBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const Profile = require('../database/models/Profile');
const RoleManager = require('../utils/roleManager');
const ChannelManager = require('../utils/channelManager');

module.exports = {
  async handleButtonInteraction(interaction) {
    const { customId, user, member, guild } = interaction;

    switch (customId) {
      /** ========================
       * Gestion des rôles et salons
       ======================== **/
      case 'profile-activate-confirm': {
        try {
          console.log('Activation du système de profil commencée');
          await interaction.deferReply({ ephemeral: true });

          const roles = [];
          const categoryColors = {
            sexualité: '#1B263B',
            pronom: '#3498DB',
            location: '#5DADE2',
            interet: '#85C1E9',
            status_dm: '#154360',
            relation: '#1ABC9C',
            preference: '#A9CCE3',
            misc: '#AED6F1',
          };

          Object.keys(RoleManager.roleCategories).forEach((category) => {
            RoleManager.roleCategories[category].forEach((role) => {
              roles.push({ name: role, color: categoryColors[category] });
            });
          });
          console.log('Début de la création des rôles');
          await RoleManager.createRoles(guild, roles);
          console.log('Rôles créés avec succès');

          const channels = [
            { name: '📌┃profile-setup', topic: 'Configurer votre profil ici. Utilisez les options disponibles.' },
            { name: '👩┃profile-femme', topic: 'Profils féminins visibles ici.' },
            { name: '👨┃profile-homme', topic: 'Profils masculins visibles ici.' },
            { name: '🌈┃profile-autre', topic: 'Profils non-binaires ou autres.' },
            { name: '🎭┃self-role-profile', topic: 'Choisissez vos rôles personnels.' },
            { name: '✅┃verification', topic: 'Vérifiez votre compte.' },
            { name: '🏅┃badge', topic: 'Explications sur les badges.' },
          ];
          console.log('Début de la création des salons');
          await ChannelManager.createChannels(guild, channels);
          console.log('Salons créés avec succès');

          const selfRoleChannel = guild.channels.cache.find(ch => ch.name === '🎭┃self-role-profile');
          if (selfRoleChannel) {
            const embed = new EmbedBuilder()
              .setTitle('Personnalisez votre profil ! 🎭')
              .setDescription(
                'Sélectionnez les rôles qui vous représentent pour les afficher sur votre profil. Cliquez sur le bouton ci-dessous pour commencer.'
              )
              .setColor('#3498DB');

            const roleButton = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel('Modifier mes rôles')
                .setCustomId('edit-roles')
                .setStyle(ButtonStyle.Primary)
            );

            await selfRoleChannel.send({ embeds: [embed], components: [roleButton] });
            console.log('Embed envoyé dans le salon 🎭┃self-role-profile');
          }

          return interaction.editReply({
            content: '✅ Système de profil activé avec succès ! Les salons et rôles ont été créés.',
          });
        } catch (error) {
          console.error("❌ Erreur lors de l'activation du système de profil :", error);
          return interaction.editReply({
            content: "❌ Une erreur est survenue lors de l'activation du système de profil.",
          });
        }
      }

      case 'profile-desactivate-confirm': {
        try {
          console.log('Désactivation du système de profil commencée');
          await interaction.deferReply({ ephemeral: true });

          const rolesToDelete = Object.values(RoleManager.roleCategories).flat();
          const channelsToDelete = [
            '📌┃profile-setup',
            '👩┃profile-femme',
            '👨┃profile-homme',
            '🌈┃profile-autre',
            '🎭┃self-role-profile',
            '✅┃verification',
            '🏅┃badge',
          ];

          console.log('Début de la suppression des rôles');
          for (const roleName of rolesToDelete) {
            const role = guild.roles.cache.find((r) => r.name === roleName);
            if (role) await role.delete();
          }
          console.log('Rôles supprimés.');

          console.log('Début de la suppression des salons');
          for (const channelName of channelsToDelete) {
            const channel = guild.channels.cache.find((ch) => ch.name === channelName);
            if (channel) await channel.delete();
          }
          console.log('Salons supprimés.');

          return interaction.editReply({
            content: '✅ Système de profil désactivé avec succès. Les rôles et salons associés ont été supprimés.',
          });
        } catch (error) {
          console.error("❌ Erreur lors de la désactivation du système de profil :", error);
          return interaction.editReply({
            content: "❌ Une erreur est survenue lors de la désactivation du système de profil.",
          });
        }
      }

      case 'profile-activate-cancel': {
        await interaction.deferReply({ ephemeral: true });
        return interaction.editReply({
          content: '❌ Activation du système de profil annulée.',
        });
      }

      /** ========================
       * Gestion des rôles (Edit Roles)
       ======================== **/
       case 'edit-roles': {
        const categories = Object.keys(RoleManager.roleCategories).map((category) => ({
            id: category,
            label: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
        }));
    
        if (!categories.length) {
            return interaction.reply({
                content: '❌ Aucune catégorie de rôles disponible.',
                ephemeral: true,
            });
        }
    
        const buttons = categories.map((category) =>
            new ButtonBuilder()
                .setLabel(category.label)
                .setCustomId(`edit-role-${category.id}`)
                .setStyle(ButtonStyle.Primary)
        );
    
        const rows = [];
        for (let i = 0; i < buttons.length; i += 5) {
            rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
        }
    
        const embed = new EmbedBuilder()
            .setTitle('Modifier vos rôles')
            .setDescription('Choisissez une catégorie pour modifier vos rôles.')
            .setColor('#3498DB');
    
        await interaction.deferReply({ ephemeral: true });
        return interaction.editReply({
            embeds: [embed],
            components: rows,
        });
    }
    
    case customId.startsWith('edit-role-') && customId: {
        const category = customId.replace('edit-role-', '');
        const roles = RoleManager.getRolesByCategory(category);
    
        if (!roles || roles.length === 0) {
            return interaction.reply({
                content: `❌ Aucun rôle disponible pour la catégorie **${category}**.`,
                ephemeral: true,
            });
        }
    
        const roleMenu = new StringSelectMenuBuilder()
            .setCustomId(`select-roles-${category}`)
            .setPlaceholder('Choisissez vos rôles...')
            .setMinValues(0)
            .setMaxValues(roles.length)
            .addOptions(
                roles.map((role) => ({
                    label: role,
                    value: role,
                }))
            );
    
        const roleRow = new ActionRowBuilder().addComponents(roleMenu);
    
        await interaction.deferReply({ ephemeral: true });
        return interaction.editReply({
            content: `Sélectionnez vos rôles pour la catégorie **${category}**.`,
            components: [roleRow],
        });
    }
    
    case customId.startsWith('select-roles-') && customId: {
        try {
            const category = customId.replace('select-roles-', '');
            const { guild, member } = interaction;
    
            if (!guild || !member) {
                return interaction.reply({
                    content: '❌ Une erreur interne est survenue. Veuillez réessayer plus tard.',
                    ephemeral: true,
                });
            }
    
            await guild.roles.fetch();
    
            const selectedRoles = interaction.values || [];
            const allRoles = RoleManager.getRolesByCategory(category);
    
            if (!Array.isArray(allRoles) || allRoles.length === 0) {
                return interaction.reply({
                    content: `❌ Aucun rôle disponible pour la catégorie **${category}**.`,
                    ephemeral: true,
                });
            }
    
            await interaction.deferReply({ ephemeral: true });
    
            // Suppression des anciens rôles
            const memberRoles = member.roles.cache.map(role => role.name);
            const rolesToRemove = allRoles.filter(role => memberRoles.includes(role));
            for (const roleName of rolesToRemove) {
                const role = guild.roles.cache.find(r => r.name === roleName);
                if (role) {
                    await member.roles.remove(role);
                }
            }
    
            // Ajout des nouveaux rôles
            for (const roleName of selectedRoles) {
                const role = guild.roles.cache.find(r => r.name === roleName);
                if (role) {
                    await member.roles.add(role);
                }
            }
    
            return interaction.editReply({
                content: `✅ Vos rôles ont été mis à jour : ${selectedRoles.join(', ')}`,
            });
        } catch (error) {
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: '❌ Une erreur critique est survenue lors de la mise à jour des rôles.',
                });
            } else {
                await interaction.reply({
                    content: '❌ Une erreur critique est survenue lors de la mise à jour des rôles.',
                    ephemeral: true,
                });
            }
        }
    }
    case 'edit-roles': {
      const categories = Object.keys(RoleManager.roleCategories).map((category) => ({
          id: category,
          label: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
      }));
  
      if (!categories.length) {
          return interaction.reply({
              content: '❌ Aucune catégorie de rôles disponible.',
              ephemeral: true,
          });
      }
  
      const buttons = categories.map((category) =>
          new ButtonBuilder()
              .setLabel(category.label)
              .setCustomId(`edit-role-${category.id}`)
              .setStyle(ButtonStyle.Primary)
      );
  
      const rows = [];
      for (let i = 0; i < buttons.length; i += 5) {
          rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
      }
  
      const embed = new EmbedBuilder()
          .setTitle('Modifier vos rôles')
          .setDescription('Choisissez une catégorie pour modifier vos rôles.')
          .setColor('#3498DB');
  
      await interaction.deferReply({ ephemeral: true });
      return interaction.editReply({
          embeds: [embed],
          components: rows,
      });
  }
  
  case customId.startsWith('edit-role-') && customId: {
      const category = customId.replace('edit-role-', '');
      const roles = RoleManager.getRolesByCategory(category);
  
      if (!roles || roles.length === 0) {
          return interaction.reply({
              content: `❌ Aucun rôle disponible pour la catégorie **${category}**.`,
              ephemeral: true,
          });
      }
  
      const roleMenu = new StringSelectMenuBuilder()
          .setCustomId(`select-roles-${category}`)
          .setPlaceholder('Choisissez vos rôles...')
          .setMinValues(0)
          .setMaxValues(roles.length)
          .addOptions(
              roles.map((role) => ({
                  label: role,
                  value: role,
              }))
          );
  
      const roleRow = new ActionRowBuilder().addComponents(roleMenu);
  
      await interaction.deferReply({ ephemeral: true });
      return interaction.editReply({
          content: `Sélectionnez vos rôles pour la catégorie **${category}**.`,
          components: [roleRow],
      });
  }
  
  case customId.startsWith('select-roles-') && customId: {
      try {
          const category = customId.replace('select-roles-', '');
          const { guild, member } = interaction;
  
          if (!guild || !member) {
              return interaction.reply({
                  content: '❌ Une erreur interne est survenue. Veuillez réessayer plus tard.',
                  ephemeral: true,
              });
          }
  
          await guild.roles.fetch();
  
          const selectedRoles = interaction.values || [];
          const allRoles = RoleManager.getRolesByCategory(category);
  
          if (!Array.isArray(allRoles) || allRoles.length === 0) {
              return interaction.reply({
                  content: `❌ Aucun rôle disponible pour la catégorie **${category}**.`,
                  ephemeral: true,
              });
          }
  
          await interaction.deferReply({ ephemeral: true });
  
          // Suppression des anciens rôles
          const memberRoles = member.roles.cache.map(role => role.name);
          const rolesToRemove = allRoles.filter(role => memberRoles.includes(role));
          for (const roleName of rolesToRemove) {
              const role = guild.roles.cache.find(r => r.name === roleName);
              if (role) {
                  await member.roles.remove(role);
              }
          }
  
          // Ajout des nouveaux rôles
          for (const roleName of selectedRoles) {
              const role = guild.roles.cache.find(r => r.name === roleName);
              if (role) {
                  await member.roles.add(role);
              }
          }
  
          return interaction.editReply({
              content: `✅ Vos rôles ont été mis à jour : ${selectedRoles.join(', ')}`,
          });
      } catch (error) {
          if (interaction.deferred || interaction.replied) {
              await interaction.editReply({
                  content: '❌ Une erreur critique est survenue lors de la mise à jour des rôles.',
              });
          } else {
              await interaction.reply({
                  content: '❌ Une erreur critique est survenue lors de la mise à jour des rôles.',
                  ephemeral: true,
              });
          }
      }
  }
  
      /** ========================
       * Gestion des profils (embeds avec boutons)
       ======================== **/
      case 'create-profile': {
        const existingProfile = await Profile.findOne({ userId: user.id });

        if (existingProfile) {
          await interaction.deferReply({ ephemeral: true });
          return interaction.editReply({
            content: '❌ Vous avez déjà un profil. Utilisez "Modifier un profil" pour le mettre à jour.',
          });
        }

        const modal = new ModalBuilder()
          .setCustomId('create-profile-modal')
          .setTitle('Créer un profil');

        modal.addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('profile-name')
              .setLabel('Quel est votre nom ?')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('profile-location')
              .setLabel('D’où venez-vous ?')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('profile-status')
              .setLabel('Quel est votre statut ?')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('profile-about')
              .setLabel('Parlez-nous de vous.')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(false)
          )
        );

        return interaction.showModal(modal);
      }

      case 'edit-profile': {
        const profile = await Profile.findOne({ userId: user.id });

        if (!profile) {
          await interaction.deferReply({ ephemeral: true });
          return interaction.editReply({
            content: '❌ Vous n’avez pas encore de profil. Utilisez "Créer un profil" pour en créer un.',
          });
        }

        const modal = new ModalBuilder()
          .setCustomId('edit-profile-modal')
          .setTitle('Modifier votre profil');

        modal.addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('profile-name')
              .setLabel('Modifier votre nom')
              .setValue(profile.name || '')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('profile-location')
              .setLabel('Modifier votre lieu')
              .setValue(profile.location || '')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('profile-status')
              .setLabel('Modifier votre statut')
              .setValue(profile.status || '')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('profile-about')
              .setLabel('Modifier votre description')
              .setValue(profile.about || '')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(false)
          )
        );

        return interaction.showModal(modal);
      }

      default:
        console.warn(`⚠️ Bouton inconnu : ${customId}`);
        await interaction.deferReply({ ephemeral: true });
        return interaction.editReply({
          content: '❌ Action non reconnue.',
        });
    }
  },
};
