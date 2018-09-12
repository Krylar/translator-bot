const translate = require('google-translate-api');
const yandex = require('yandex-translate')('trnsl.1.1.20180819T211713Z.1cbd110241e5bdb6.19f384b50b01a0ffc79840ce031ba61de0a8e6ed');

exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
//  message.reply(`Your permission level is: ${level} - ${friendly}`);
//message.reply("DEBUG: command: add {#args: " + args.length + "}");

  // check for correct # arguments
  if(args.length < 2) {
    message.channel.send(`Missing argument!`);
    return;
  }
message.reply("args past");
  // Get DB record for current channel / category / server
  targetChannel = message.guild.channels.get(args[0]);
  if(!targetChannel) {
    message.reply(`Channel id "${args[0]}" not found!`);
    return;
  }
message.reply("targetChannel passed: " + args[0]);
  key = message.guild.id + "_" + targetChannel.id;
message.reply(`key: ${key}`);
//  message.reply(`Server ID: ${message.guild.id}\nCategory ID: ${message.channel.parent.id}\nChannel ID: ${message.channel.id}`);
  tchan = await client.tchannels.get(key);
  if(tchan) {
    message.reply(`This channel is already in translation group \"${tchan.group_name}\"!`);
//    client.tchannels.delete(key);
    return;
  }
message.reply("tchan passed");
  // check if user has Manage Channel permissions in target channel
  if(!targetChannel.permissionsFor(message.member).has("MANAGE_MESSAGES")) {
    message.reply("You do not have permission to do this!");
    return;
  }
message.reply("perm check passed");
  // create tchannel object
  tchan = {
    guild_id: message.guild.id, // server id
    channel_id: targetChannel.id, //channel id
    category_id: targetChannel.parent.id, // category id
    category_bound: args[5] || true, // translate only 
    group_name: args[1],  // name of translation group
    language: args[2],  // language code to use for translator
    translator: args[3] || "google",  // which translator to use?
    canPost: args[4] || true  // allow bot to post to this channel?
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
  name: "sadd",
  category: "Translation Groups",
  description: "Add this channel to translation group",
  usage: "sadd <channel ID> <group name> <language> <translator> <can post?> <category bound?>"
};
