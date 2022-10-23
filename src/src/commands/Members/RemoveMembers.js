const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const DiscordOauth2 = require("discordouth3");
const Users = require("../../../data/mongo");

module.exports = class AddMemberCommand extends BaseCommand {
  constructor() {
    super("removeMembers", "Members", []);
  }
  
  async run(client, message, args) {
    if (message.guild && message.guild.id !== client.config.serverID) return;
    if (!client.owners.includes(message.author.id)) return;
    const oauth = new DiscordOauth2();
    let guildId = args[0]
    let count = args[1]
    let guild = client.guilds.cache.get(guildId)
    if (!guildId || !guild) return message.reply({content: `I'm not in this guild .`})
    if (!count || (isNaN(count) && count !== 'all')) return message.reply({content: `You should specify a vaild amount of tokens <amount / all> .`})
    const users = await Users.find();
  if (count !== 'all') {
let members = await guild.members.fetch()
let xx = users.filter(e => members.find(ee => ee.user.id === e.userId));
let not = users.length - xx.length
    if (xx.length < count) {
      message?.reply({content: `There is only **${xx.length}** token in **${guild.name}**`})
      return;
    }
            let i = 0
        let r = 0
            let timeout;
        message?.reply({content: `Tried to remove **${count} Token**\n\nRemoved: **${i}**\nFailed: **${r}**`}).then(m => {
            timeout = setInterval(() => {
                m?.edit({content: `Tried to remove **${count} Token**\n\nRemoved: **${i}**\nFailed: **${r}**`})
               if (i+r == count) return clearInterval(timeout)
            }, 5000)
        })
        for (let x = 0; x<count; x++) {
          let user = xx[x]
            if (user.accessToken) {
              oauth.removeMember({
                guildId: guildId,
                botToken: client.token,
                userId: user.userId,
              }).then(m => {
                  i+=1
              }).catch(err => {
                  r+=1
              })
            } else {
                r+=1
            }
        }
  } else {
    count = users.length
    let members = await guild.members.fetch()
    let xx = users.filter(e => members.find(ee => ee.user.id === e.userId));
    count = xx.length
    if (count == 0) {
      message?.reply({content: `There is no tokens in **${guild.name}**, nothing to remove .`})
      return;
    }
    let not = users.length - xx.length
            let i = 0
        let r = 0
            let timeout;
        message?.reply({content: `Tried to remove **${xx.length} Token**\n\nRemoved: **${i}**\nFailed: **${r}**`}).then(m => {
            timeout = setInterval(() => {
                m?.edit({content: `Tried to remove **${xx.length} Token**\n\nRemoved: **${i}**\nFailed: **${r}**`})
               if (i+r == count) return clearInterval(timeout)
            }, 5000)
        })
        for (let x = 0; x<xx.length; x++) {
          let user = xx[x]
            if (user.accessToken) {
              oauth.removeMember({
                guildId: guildId,
                botToken: client.token,
                userId: user.userId,
              }).then(m => {
                  i+=1
              }).catch(err => {
                  r+=1
              })
            } else {
                r+=1
            }
        }
      }
  }
};
