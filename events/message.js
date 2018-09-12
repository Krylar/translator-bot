// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, message) => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // Grab the settings for this server from Enmap.
  // If there is no guild, get default conf (DMs)
  const settings = message.settings = client.getGuildSettings(message.guild);

  // Checks if the bot was mentioned, with no message after it, returns the prefix.
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    return message.reply(`My prefix on this guild is \`${settings.prefix}\``);
  }

  // ***** 8/18/18 Krylar: process translation group *****
//  if (message.channel = message.guild.channels.find("name", "general_en")) {
//  message.channel.send('channel id: ' + message.channel.id.toString());
/*  index = client.config.tgroup.findIndex(fruit => fruit == message.channel.id);
  if (index > -1
      && message.content.indexOf("?") !== 0
      && message.content.indexOf("!") !== 0
      && message.guild.id == 418889935316058112

  ) {
//    message.channel.send('translation group detected. translating to group...');
    const cmd2 = client.commands.get("gtr") || client.commands.get(client.aliases.get("gtr"));
    cmd2.run(client, message, client.config.tgroup, client.permlevel(message));
  }
*/
  key = message.guild.id + "_" + message.channel.id;
  index = await client.tchannels.get(key);

  if(index
      && message.content.indexOf("?") !== 0
      && message.content.indexOf("!") !== 0
  ) {
    const cmd2 = client.commands.get("gtr") || client.commands.get(client.aliases.get("gtr"));
    cmd2.run(client, message, index, client.permlevel(message));
  }

  // ***** 8/18/18 Krylar: process translation group *****
//  if (message.channel = message.guild.channels.find("name", "general_en")) {
//  message.channel.send('channel id: ' + message.channel.id.toString());
/*  index = client.config.tgroup804.findIndex(fruit => fruit == message.channel.id);
//    message.channel.send('index: ' + index);
//    message.channel.send('channeld.id: ' + message.channel.id);
  if (index > -1 
      && message.content.indexOf("?") !== 0
      && message.content.indexOf("!") !== 0
      && message.guild.id == 480523487723651092

  ) {
//    message.channel.send('translation group detected. translating to group...');
    const cmd2 = client.commands.get("gtr") || client.commands.get(client.aliases.get("gtr"));
    cmd2.run(client, message, client.config.tgroup804, client.permlevel(message));
  }
*/
  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if (message.content.indexOf(settings.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // If the member on a guild is invisible or not cached, fetch them.
  if (message.guild && !message.member) await message.guild.fetchMember(message.author);

  // Get the user or member's permission level from the elevation
  const level = client.permlevel(message);

  // Check whether the command, or alias, exist in the collections defined
  // in app.js.
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  // using this const varName = thing OR otherthign; is a pretty efficient
  // and clean way to grab one of 2 values!
  if (!cmd) return;

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      return message.channel.send(`You do not have permission to use this command.
  Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
  This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    } else {
      return;
    }
  }

  // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
  // The "level" command module argument will be deprecated in the future.
  message.author.permLevel = level;
  
  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  // If the command exists, **AND** the user has permission, run it.
  client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
  cmd.run(client, message, args, level);
};
