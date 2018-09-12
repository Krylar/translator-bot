const { version } = require("discord.js");
//const moment = require("moment");
//require("moment-duration-format");
const translate = require('google-translate-api');
const yandex = require('yandex-translate')('trnsl.1.1.20180819T211713Z.1cbd110241e5bdb6.19f384b50b01a0ffc79840ce031ba61de0a8e6ed');

exports.run = (client, message, [toLang, ...txt], level) => { // eslint-disable-line no-unused-vars
//  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
/*  message.channel.send(`= STATISTICS =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${client.users.size.toLocaleString()}
• Servers    :: ${client.guilds.size.toLocaleString()}
• Channels   :: ${client.channels.size.toLocaleString()}
• Discord.js :: v${version}
• Node       :: ${process.version}`, {code: "asciidoc"});
*/
/*
  translate(args.join(" "), {to: 'en'}).then(res => {
    message.channel.send('en: ' + res.text);
  }).catch(err => {
    console.error(err);
  });

  translate(args.join(" "), {to: 'ko'}).then(res => {
    message.channel.send('ko: ' + res.text);
  }).catch(err => {
    console.error(err);
  });

  translate(args.join(" "), {to: 'de'}).then(res => {
    message.channel.send('de: ' + res.text);
  }).catch(err => {
    console.error(err);
  });
*/
//  message.channel.send('toLang: ' + toLang);
//  message.channel.send('txt: ' + txt);

var lang = toLang.toString();
var txtMsg = txt.join(" ");

  translate(txtMsg, {to: lang}).then(res => {
    message.channel.send(lang + '(g): ' + res.text);
  }).catch(err => {
    console.error(err);
  });

  /*yandex.translate(txtMsg, { to: lang }, function(err, res) {
    translation = res.text;
    message.channel.send(lang + '(y): ' + translation);
  });
*/
  yandex.translate(txtMsg, { to: lang }, function(err, res) {
    message.channel.send(lang + '(y): ' + res.text);
    console.log(res.text);
  });

/*
  translate(args.join(" "), {to: 'zh-cn'}).then(res => {
    message.channel.send('zh-cn: ' + res.text);
  }).catch(err => {
    console.error(err);
  });

  translate(args.join(" "), {to: 'nl'}).then(res => {
    message.channel.send('nl: ' + res.text);
  }).catch(err => {
    console.error(err);
  });

  translate(args.join(" "), {to: 'fr'}).then(res => {
    message.channel.send('fr: ' + res.text);
  }).catch(err => {
    console.error(err);
  });
*/



};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "tr",
  category: "Miscelaneous",
  description: "Translate message using both Google & Yandex",
  usage: "tr <lang> <message>"
};
