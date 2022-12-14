const BaseEvent = require("../../utils/structures/BaseEvent");

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super("messageCreate");
  }

  async run(client, message) {
    if (message.author.bot) return;
    if (message.content.startsWith(client.prefix)) {

      const [cmdName, ...cmdArgs] = message.content
        .slice(client.prefix.length)
        .split(/\s+/);
      const command = client.commands.get(cmdName.toLowerCase());
      if (command) {
        await command.run(client, message, cmdArgs);
      }
    }
  }
};
