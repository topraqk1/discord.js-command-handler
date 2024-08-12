const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder
} = require('discord.js');
const config = require('../config.js');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    const client = message.client;

    if (message.author.bot) return;

    const prefix = config.bot.prefix;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.prefixcommands.get(commandName) || client.prefixcommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.ownerOnly && !config.bot.owners.includes(message.author.id)) return;

    if (command.guildOnly && !message.guild) return;

    if (!client.cooldowns) {
      client.cooldowns = new Map();
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name) || new Map();
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    client.cooldowns.set(command.name, timestamps);

    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error('Error executing command:', error);
      message.reply('There was an error executing that command.');
    }
  }
}