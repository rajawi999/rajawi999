const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class AddMemberCommand extends BaseCommand {
  constructor() {
    super("ping", "Public", []);
  }

  async run(client, message, args) {
    message.reply({content: `Ping **${client.ws.ping}ms**!`})
  }
};
