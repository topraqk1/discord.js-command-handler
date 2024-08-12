const {
  REST
} = require('discord.js');
const {
  Routes
} = require('discord-api-types/v10');
const config = require('../config.js');
const fs = require('fs');
const colors = require('color-console.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(colors.yellow(colors.bold('\n[CLIENT]')), colors.blue(colors.bold(client.user.username)), colors.green(('Client is Ready.')));

    const commands = [];
    const slashCommandFiles = fs.readdirSync('./Commands/Slash').filter(file => file.endsWith('.js'));

    for (const file of slashCommandFiles) {
      const command = require(`../Commands/Slash/${file}`);
      const d = command.data.toJSON()
      commands.push(d);
    }

    const rest = new REST({
      version: '10'
    }).setToken(config.bot.token);

    (async () => {
      try {
        await rest.put(Routes.applicationCommands(client.user.id), {
          body: commands
        });
        console.log('Slash commands registered successfully.');
      } catch (error) {
        console.error(error);
      }
    })();
  },
};