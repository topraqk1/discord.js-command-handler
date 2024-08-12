const {
  EmbedBuilder
} = require('discord.js');
const {
  HelixiaDB
} = require('helixia.db');
const db = new HelixiaDB();

module.exports = {
  name: "ping",
  aliases: ["p"],
  description: "Writes the ping of the bot.",
  ownerOnly: false,
  guildOnly: false,
  cooldown: 5000,
  async execute(message, client, args) {
    await message.reply({
      content: `Bot Ping: **${client.ws.ping}**`
    })
  }
}