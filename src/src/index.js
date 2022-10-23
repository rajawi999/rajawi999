const { Client, Intents } = require("discord.js");
const { registerCommands, registerEvents } = require("./utils/registry");
const config = require("../slappey.json");
const client = new Client({
  intents: 32767,
});

(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.config = require("../../config.json");
  client.prefix = client.config.prefix;
  client.owners = client.config.owners
  await registerCommands(client, "../commands");
  await registerEvents(client, "../events");
  await client.login(process.env.token);
})();
