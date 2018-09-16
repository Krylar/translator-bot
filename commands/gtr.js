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
  var rnd = 0;

  chans.forEach(async function(element) {
    var tchan = message.guild.channels.find(chan => chan.id == element.channel_id);
    var translation = '';
    var lang = element.language;
//    var canPost = elment.canPost; // OK to post to this channel? (vs read-only)

    if(element.translator == "google" || !element.translator || lang == "lop") {
      var l2=lang;
      if(lang=="lop") {
        l2 = lang;
        lang = "en";
      }
      var res = await translate(message.content, {to: lang});
//      console.log("google");
      if(l2) lang=l2;
      // convert user mentions in translation
      translation = res.text.replace(/(?=<@).*?(?:>)/g, (match, p1, p2, p3, offset, string) => {
        var uid = match.match(/\d+/).toString();
        var userobj = message.mentions.members.get(uid);
        return userobj;
      });
      // convert channel mentions in translation
      translation = translation.replace(/＃/g, "#");
      translation = translation.replace(/(?=<#).*?(?:>)/g, (match, p1, p2, p3, offset, string) => {
        var uid = match.match(/\d+/).toString();
        var userobj = message.mentions.channels.get(uid);
        return userobj;
      });
    }

    // Lop translation
    if(element.translator == "custom" && lang == "lop") {
//      console.log("translating LOP!");
      var content = translation;
      translation = ":rabbit:";
      content.split(' ').forEach(word => {
        rnd = Math.floor(Math.random() * 101);
//        console.log(rnd);

        if(word.match(/^(rabbit|bunny|hare|cony|coney|pika|hyrax|chinchilla|cottontail|leveret|lapin|buck|rodent|lagomorph|doe)$/i)) {
          translation += " Lop";
        }
        else if(word.match(/^(rabbits|bunnies|hares|conies|pikas|hyraxes|chinchillas|cottontails|leverets|lapins|bucks|rodents|lagomorphs)$/i)) {
          translation += " Lops";
        }
        else if(rnd<1) translation += " !$@#";
        else if(rnd>=1 && rnd<10) translation += " cluck";
        else if(rnd>=10 && rnd<20) translation += " purr";
        else if(rnd>=20 && rnd<30) translation += " hum";
        else if(rnd>=30 && rnd<40) translation += " growl";
        else if(rnd>=40 && rnd<50) translation += " snort";
        else if(rnd>=50 && rnd<60) translation += " hiss";
        else if(rnd>=60 && rnd<70) translation += " whine";
        else if(rnd>=70 && rnd<80) translation += " stomp";
        else if(rnd>=80 && rnd<90) translation += " whimper";
        else if(rnd>=90 && rnd<99) translation += " scream";
        else if(rnd>=99 && rnd<=100) translation += " :rabbit:";
      });
      translation += " :rabbit2:";
//      console.log("rabbit");
    }


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

