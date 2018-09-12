const { version } = require("discord.js");
//const moment = require("moment");
//require("moment-duration-format");
const translate = require('google-translate-api');
//const yandex = require('yandex-translate')('trnsl.1.1.20180819T211713Z.1cbd110241e5bdb6.19f384b50b01a0ffc79840ce031ba61de0a8e6ed');

exports.run = async (client, message, srcChannel, level) => { // eslint-disable-line no-unused-vars

  // get other channels in translation group
  key = srcChannel.id;
  chans = client.tchannels.filter(c => c.guild_id === srcChannel.guild_id
      && c.group_name === srcChannel.group_name
      && c.category_id === message.channel.parent.id
      && c.channel_id !== srcChannel.channel_id
      && (c.canPost || true)
  );

  // if no other channels in translation group, then exit
  if(!chans)
    return;

  chans.forEach(async function(element) {
    var tchan = message.guild.channels.find(chan => chan.id == element.channel_id);
    var translation = '';
    var lang = element.language;
//    var canPost = elment.canPost; // OK to post to this channel? (vs read-only)

    if(element.translator == "google" || !element.translator)
      res = await translate(message.content, {to: lang})

    // convert user mentions in translation
    translation = res.text.replace(/(?=<@).*?(?:>)/g, (match, p1, p2, p3, offset, string) => {
      var uid = match.match(/\d+/).toString();
      var userobj = message.mentions.members.get(uid);
      return userobj;
    });

//    console.log(`${lang} pre-channel tag: ${translation}`);
    // convert channel mentions in translation
    translation = res.text.replace(/＃/g, "#");
//    console.log(`${lang} mid-channel tag: ${translation}`);
    translation = res.text.replace(/(?=<#).*?(?:>)/g, (match, p1, p2, p3, offset, string) => {
      var uid = match.match(/\d+/).toString();
      var userobj = message.mentions.channels.get(uid);
      return userobj;
    });
//    console.log(`${lang} post-channel tag: ${translation}`);

//    console.log("===> " + translation);

    // send translated text to other language channels in the group
  if(message.attachments.size >> 0) {
    urls = new Array();
    message.attachments.forEach(e => {
      urls.push(e.url);
    });
    tchan.send("",{embed: {
        color: 3447003,
        author: {
          name: message.author.username,
          icon_url: message.author.avatarURL
        },
        description: translation
      }
      , files: urls
} //embed
    ); //tchan.send
/*    tchan.send({embed: {
        color: 3447003,
        author: {
          name: message.author.username,
          icon_url: message.author.avatarURL
        },
        description: translation
      }} //embed
//      , {files: urls}
    ); //tchan.send*/
  }
  else {
    tchan.send({embed: {
        color: 3447003,
        author: {
          name: message.author.username,
          icon_url: message.author.avatarURL
        },
        description: translation
//        , url: message.url
      }} //embed
//      , {files: message.attachments}
    ); //tchan.send
  }
/*
    else if(element.translator == "yandex") {
      yandex.translate(message.content, { to: lang }, function(err, res) {
         //tchan.send(res.text);
         tchan.send({embed: {
             color: 3447003,
             author: {
               name: message.author.username,
               icon_url: message.author.avatarURL
             },
             description: res.text.replace('/[<@!>]/g', mentionReplacer),
         }
         });
    }); // end else
    }
*/
  }); // end forEach

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "gtr",
  category: "Miscelaneous",
  description: "Translate message to other channels in translation group",
  usage: "gtr <message>"
};

