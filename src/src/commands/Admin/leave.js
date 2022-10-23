const BaseCommand = require("../../utils/structures/BaseCommand");
const {Util} = require('discord.js')

module.exports = class AddMemberCommand extends BaseCommand {
  constructor() {
    super("leave", "Admin", []);
  }

  async run(client, message, args) {
    if (message.guild && message.guild.id !== client.config.serverID) return;
    if (!client.owners.includes(message.author.id)) return;
    let guildId = args[0]
    let guild = client.guilds.cache.get(guildId)
    if (!guildId || !guild) return message.reply({content: `I'm not in this guild .`})
    guild.leave()
    message.reply({content: `Successfully left **${guild.name}**`})
  }
};
