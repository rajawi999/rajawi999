const BaseCommand = require("../../utils/structures/BaseCommand");
const {Util} = require('discord.js')

module.exports = class AddMemberCommand extends BaseCommand {
  constructor() {
    super("servers", "Admin", []);
  }

  async run(client, message, args) {
    if (message.guild && message.guild.id !== client.config.serverID) return;
    if (!client.owners.includes(message.author.id)) return;
    let servers = client.guilds.cache.map(e => `**${e.name}** - \`${e.id}\``).join('\n')
    Util.splitMessage(servers).forEach(m => {
      message.reply({content: m})
    })
  }
};
