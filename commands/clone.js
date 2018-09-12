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
  if(args.length < 1) {
    message.channel.send(`Missing argument!`);
    return;
  }

// Get DB record for current channel / category / server
  key = message.guild.id + "_" + message.channel.id;
  group_name = client.tchannels.get(key).group_name;;
  language = args[0];
  translator = args[1]; // optional

  // get role for language
  langRole = message.guild.roles.find(r => r.name == language);
  if(!langRole) {
    message.reply("Could not find role for language \"" + args[1] + "\"");
    return;
  }

  // new channel name
  newChannel = message.channel.name.match(/.*(?=_)/); // + "_" + language;
  if(!newChannel)
//    console.log("newChannel = " + newChannel);
    newChannel = message.channel.name;
  newChannel += "_" + language;

  // Clone a channel
  console.log("cloning \'" + newChannel + "\'...");

  message.channel.clone(newChannel, false) //, true, false, 'Needed a clone')
    .then(clone => {
      tkey = message.guild.id + "_" + clone.id;
      console.log(`Cloned ${message.channel.name} to make a channel called ${clone.name}`);
      clone.setParent(message.channel.parent);
      clone.setPosition(message.channel.position);

      // add cloned channel to translation group
      // create tchannel object
      tchan = {
        guild_id: message.guild.id,
        category_id: clone.parent.id,
        channel_id: clone.id,
        group_name: group_name,
        language: language,
        translator: translator || "google"
      };
      client.tchannels.set(tkey, tchan);
      message.reply(`Channel added to translation group ${tchan.group_name}.`);

      // setup permissions

    })
    .catch(console.error);

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "clone",
  category: "Translation Groups",
  description: "Clone current channel and add to translation group",
  usage: "clone <language> <translator>"
};
