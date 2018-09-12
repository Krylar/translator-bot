const translate = require('google-translate-api');
const yandex = require('yandex-translate')('trnsl.1.1.20180819T211713Z.1cbd110241e5bdb6.19f384b50b01a0ffc79840ce031ba61de0a8e6ed');

exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
//  message.reply(`Your permission level is: ${level} - ${friendly}`);
//message.reply("DEBUG: command: add {#args: " + args.length + "}");

  // check if user has Manage Channel permissions in current channel
  if(!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES")) {
    message.reply("You do not have permission to do this!");
    return;
  }

  // check for correct # arguments
  if(args.length < 2) {
    message.channel.send(`Missing argument!`);
    return;
  }

// Get DB record for current channel / category / server
  key = message.guild.id + "_" + message.channel.id;

//  message.reply(`Server ID: ${message.guild.id}\nCategory ID: ${message.channel.parent.id}\nChannel ID: ${message.channel.id}`);
  tchan = await client.tchannels.get(key);
  if(tchan) {
    message.reply(`This channel is already in translation group \"${tchan.group_name}\"!`);
//    client.tchannels.delete(key);
    return;
  }

  // create tchannel object
  tchan = {
    guild_id: message.guild.id,
    category_id: message.channel.parent.id,
    channel_id: message.channel.id,
    group_name: args[0],
    language: args[1],
    translator: args[2] || "google",
    canPost: args[3] || true
  };
  client.tchannels.set(key, tchan);
  message.reply(`Channel added to translation group ${tchan.group_name}.`);
//  client.tchannels.delete(key);

//  message.reply(tchan.group_name);
//  message.reply(tchan.language);

//  message.reply(translate.isSupported(tchan.language));

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "add",
  category: "Translation Groups",
  description: "Add this channel to translation group",
  usage: "add <group name> <language> <translator> <can post?>"
};
