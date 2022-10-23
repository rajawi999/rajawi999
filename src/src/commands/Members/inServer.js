const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const DiscordOauth2 = require("discordouth3");
const Users = require("../../../data/mongo");

module.exports = class AddMemberCommand extends BaseCommand {
  constructor() {
    super("inServer", "Members", []);
  }

  async run(client, message, args) {
    if (message.guild && message.guild.id !== client.config.serverID) return;
    if (!client.owners.includes(message.author.id)) return;
    const oauth = new DiscordOauth2();
    let guild = client.guilds.cache.get(args[0])
    if (!guild) return message.reply({content: `I'm not in this guild .`})
    const users = await Users.find();
let members = await guild.members.fetch()
let xx = users.filter(e => members.find(ee => ee.user.id === e.userId));
    let not = users.length - xx.length
    message.reply({content: `All: **${users.length}**\nInServer: **${xx.length}**\nOutServer: **${not}**`})
  }
};
