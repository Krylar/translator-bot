//const translate = require('google-translate-api');
//const yandex = require('yandex-translate')('trnsl.1.1.20180819T211713Z.1cbd110241e5bdb6.19f384b50b01a0ffc79840ce031ba61de0a8e6ed');

exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
//  message.reply(`Your permission level is: ${level} - ${friendly}`);

  // check if user has Manage Channel permissions in current channel
  if(!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES")) {
    message.reply("You do not have permission to do this!");
    return;
  }

// Get DB record for current channel / category / server
  key = args[0] || message.guild.id + "_" + message.channel.id;

//  message.reply(`Server ID: ${message.guild.id}\nCategory ID: ${message.channel.parent.id}\nChannel ID: ${message.channel.id}`);
  tchan = await client.tchannels.get(key);
  if(tchan) {
    client.tchannels.delete(key);
    client.tchannels.delete(key);
    message.reply(`Channel removed from translation group ${tchan.group_name}!`);
    return;
  }
  else {
    message.reply(`Channel not in a translation group!`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["delete","del"],
  permLevel: "User"
};

exports.help = {
  name: "remove",
  category: "Translation Groups",
  description: "Remove this channel from current translation group",
  usage: "remove [key]"
};
