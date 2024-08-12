const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder
} = require('discord.js');
const {
  HelixiaDB
} = require('helixia.db');
const db = new HelixiaDB();

module.exports = {
  data: new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Writes the ping of the bot.'),
  ownerOnly: false,
  guildOnly: false,
  cooldown: 5000,
  async execute(interaction, client) {
    await interaction.reply({
      content: `Bot Ping: **${client.ws.ping}**`
    })
  }
}