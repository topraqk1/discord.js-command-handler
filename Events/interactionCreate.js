const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder
} = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    const client = interaction.client;

    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    if (command.ownerOnly && !client.owners.includes(interaction.user.id)) return;

    if (command.guildOnly && !interaction.guild) return;

    if (!client.cooldowns) {
      client.cooldowns = new Map();
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name) || new Map();
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return interaction.reply({
          content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.data.name}\` command.`,
          ephemeral: true
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    client.cooldowns.set(command.name, timestamps);

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      });
    }
  },
};