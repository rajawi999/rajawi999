const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const DiscordOauth2 = require("discordouth3");
const Users = require("../../../data/mongo");

module.exports = class RefreshMembersCommand extends BaseCommand {
  constructor() {
    super("refreshMembers", "Members", []);
  }
  async run(client, message, args) {
    if (message.guild && message.guild.id !== client.config.serverID) return;
    if (!client.owners.includes(message.author.id)) return;
    const oauth2Data = {
      clientId: client.user.id,
      clientSecret: client.config.secret,
      redirectUri: client.config.redirect_url,
    };
    const oauth = new DiscordOauth2(oauth2Data);
        let i = 0
        let r = 0
        let users = await Users.find();
        users.forEach(async (user) => {
            if (user.refreshToken) {
              oauth.tokenRequest({
                  scope: ["identify", "guilds.join"],
                  refreshToken: user.refreshToken,
                  grantType: "refresh_token",
                }).then(async (userData) => {
                  await Users.findOneAndUpdate(
                    {
                      userId: user.userId,
                    },
                    {
                      userId: user.userId,
                      discordTag: user.discordTag,
                      accessToken: userData.access_token,
                      refreshToken: userData.refresh_token,
                    },
                    {
                      upsert: true,
                    }
                  );
                  i++
                }).catch(err => {
                  r++
                })
            } else {
                r+=1
            }
        });
            let timeout;
                message?.reply({content: `Tried to refresh **${users.length} Members**\n\nRefreshed: **${i}**\nFailed: **${r}**`}).then(m => {
            timeout = setInterval(() => {
                m?.edit({content: `Tried to refresh **${users.length} Members**\n\nRefreshed: **${i}**\nFailed: **${r}**`})
               if (i+r == users.length) return clearInterval(timeout)
            }, 5000)
        })
  }
};
