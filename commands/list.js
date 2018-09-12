const { version } = require("discord.js");
//const moment = require("moment");
//require("moment-duration-format");
const translate = require('google-translate-api');
const yandex = require('yandex-translate')('trnsl.1.1.20180819T211713Z.1cbd110241e5bdb6.19f384b50b01a0ffc79840ce031ba61de0a8e6ed');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  key = message.guild.id + "_" + message.channel.id;
  index = await client.tchannels.get(key);

  if(!index) {
    message.channel.send("Channel not in translation group.");
    return;
  }

//  console.log("set key = srcChannel.id");
  chans = client.tchannels.filter(c => c.guild_id === index.guild_id
      && c.group_name === index.group_name
      && c.category_id === message.channel.parent.id
//      && c.channel_id !== srcChannel.channel_id
  );
//  console.log("test chans");
  if(!chans) return;
//  console.log("chans = " + chans.size);

  msg = `Category: ${message.channel.parent}
\t- Group: ${index.group_name}`;

  chans.forEach(function(element) {
    var tchan = message.guild.channels.find(chan => chan.id == element.channel_id);
    var translation = '';
    var lang = element.language;
    msg += `\n\t\t- Channel: ${tchan}\t(${element.language}, ${element.translator})`; // [${message.guild.id}_${element.channel_id}]`;
  }); // end forEach
message.channel.send(msg);

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "list",
  category: "Miscelaneous",
  description: "List channels in this translation group",
  usage: "list"
};

