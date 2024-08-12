const {
  HelixiaDB
} = require('helixia.db');
const db = new HelixiaDB();
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  EmbedBuilder
} = require('discord.js');
const config = require('./config.js');
const fs = require('fs');
const path = require('path');
const colors = require('color-console.js');

const client = new Client({
  intents: Object.values(GatewayIntentBits),
  partials: Object.values(Partials)
})

const botToken = config.bot.token;

client.commands = new Collection();
client.prefixcommands = new Collection();
client.owners = config.bot.owners;
client.config = config;
client.db = db;
client.cooldowns = new Map();

const commandsPath = path.join(__dirname,
  'Commands/Slash');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  console.log(colors.bold(colors.yellow('[SLASH]')), colors.bold(colors.blue(command.data.name)), colors.green('Loaded.'));
  client.commands.set(command.data.name, command);
}

const prefixCommandsPath = path.join(__dirname,
  'Commands/Prefix');
const prefixCommandFiles = fs.readdirSync(prefixCommandsPath).filter(file => file.endsWith('.js'));

console.log('\n');
for (const file of prefixCommandFiles) {
  const filePath = path.join(prefixCommandsPath, file);
  const command = require(filePath);

  console.log(colors.bold(colors.yellow('[PREFIX]')), colors.bold(colors.blue(command.name)), colors.green('Loaded.'));

  client.prefixcommands.set(command.name, command);

  if (command.aliases && Array.isArray(command.aliases)) {
    command.aliases.forEach(alias => {
      client.prefixcommands.set(alias, command);
    });
  }
}

const eventsPath = path.join(__dirname, 'Events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
console.log('\n')
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const eventModule = require(filePath);

  if (Array.isArray(eventModule)) {
    for (const event of eventModule) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
      console.log(colors.bold(colors.yellow('[EVENT]')), colors.bold(colors.blue(event.name)), colors.green('Loaded.'));
    }
  } else {
    const event = eventModule;
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(colors.bold(colors.yellow('[EVENT]')), colors.bold(colors.blue(event.name)), colors.green('Loaded.'));
  }
}

client.login(botToken)

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});