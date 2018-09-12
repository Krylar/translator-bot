exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
//  message.reply(`Your permission level is: ${level} - ${friendly}`);
//  let ndx = args.findIndex(function(element) {return element === "debug"});
//  message.channel.send(`Debug? ${ndx}`);
//  if(ndx >>> 0) {
//    args.splice(ndx, 1);
//  }

/*
  if(args.length < 2) {
    message.channel.send("Error: missing arguments");
    return;
  }
*/
  // ********** SETUP **********
  // get server
  let g = message.guild;
//  if(debug) message.channel.send(`Server:: ${message.guild.name}`, {code:"asciidoc"});

  // get everyone role
  let everyoneRole = g.roles.find(r => r.name == "@everyone");
/*  if(debug) {
    if(everyoneRole) {
      message.channel.send(`Found role:: ${everyoneRole.name}`, {code:"asciidoc"});
    } else {
      message.channel.send(`Could not find role @everyone ::`, {code:"asciidoc"});
    }
  }
*/
  message.channel.send(`Found role:: ${everyoneRole.name}`, {code:"asciidoc"});

  // Find all *_en roles
/*  enRoles = g.roles.filter(prop => prop.name.substr(prop.name.length - 3) == "_en");
  message.reply(`found ${enRoles.size} *_en roles`);
  if(enRoles.size >> 0)
    enRoles.forEach(r => r.setName(r.name.match(/.*?(?=_en)/).toString()));

  // Find all *_fr roles  // Find all *_fr roles
  enRoles = g.roles.filter(prop => prop.name.substr(prop.name.length - 3) == "_fr");
  message.reply(`found ${enRoles.size} *_fr roles`);
  if(enRoles.size >> 0)
    enRoles.forEach(r => r.delete());

  // Find all *_fr roles
  enRoles = g.roles.filter(prop => prop.name.substr(prop.name.length - 3) == "_de");
  message.reply(`found ${enRoles.size} *_de roles`);
  if(enRoles.size >> 0)
    enRoles.forEach(r => r.delete());

  // Find all *_fr roles
  enRoles = g.roles.filter(prop => prop.name.substr(prop.name.length - 3) == "_ko");
  message.reply(`found ${enRoles.size} *_ko roles`);
  if(enRoles.size >> 0)
    enRoles.forEach(r => r.delete());

  // Find all *_fr roles
  enRoles = g.roles.filter(prop => prop.name.substr(prop.name.length - 3) == "_zh-cn");
  message.reply(`found ${enRoles.size} *_zh-cn roles`);
  if(enRoles.size >> 0)
    enRoles.forEach(r => r.delete());

  // Find all *_fr roles
  enRoles = g.roles.filter(prop => prop.name.substr(prop.name.length - 3) == "_ru");
  message.reply(`found ${enRoles.size} *_ru roles`);
  if(enRoles.size >> 0)
    enRoles.forEach(r => r.delete());

  // Find all *_fr roles
  enRoles = g.roles.filter(prop => prop.name.substr(prop.name.length - 3) == "_pt");
  message.reply(`found ${enRoles.size} *_pt roles`);
  if(enRoles.size >> 0)
    enRoles.forEach(r => r.delete());
*/
  // Find all *_fr roles
  enRoles = g.roles.filter(prop => prop.name.substr(prop.name.length - 6) == "_zg-cn");
  message.reply(`found ${enRoles.size} *_zg-cn roles`);
  if(enRoles.size >> 0)
    enRoles.forEach(r => r.delete());

  // Find all *_fr roles
  enRoles = g.roles.filter(prop => prop.name.substr(prop.name.length - 6) == "_zg-ch");
  message.reply(`found ${enRoles.size} *_zg-ch roles`);
  if(enRoles.size >> 0)
    enRoles.forEach(r => r.delete());

return;
  // get merging role
  let mergingRole = g.roles.find("name", "merging");


  // get merge category
  let mCategory = g.channels.find("name", "merge");
//  message.channel.send(`Merge category: ${mCategory.toString()}`, {code:"asciidoc"});

  // get merge_world_bulletin
  let mBulletin = g.channels.find("name", "merge_world_bulletin");
//  message.channel.send(`Merge bulletin channel: ${mBulletin.toString()}`);

  // get merge_chat
  let mChat = g.channels.find("name", "merge_chat");
//  message.channel.send(`Merge chat: ${mChat.toString()}`);

  // get archive category
  let archiveChat = g.channels.find("name", "archive");
//  message.channel.send(`Merge chat: ${mChat.toString()}`);

  // get merge_chat
  let aowChat = g.channels.find("name", "AoW Chats");
//  message.channel.send(`Merge chat: ${mChat.toString()}`);

//  let tgtRole = args[0];
  //message.channel.send(`Searching for role ${args[0]}...`);

  // Check if new role already exists
  let tgtRole = message.guild.roles.find("name", args[0]);
  // If new role does not exist, create new role
  // - Default color, mentionable=true, hoist=true
  // - Move to top of roles list, right below @merging role
/*  if(!tgtRole) {
    message.channel.send(`Creating role ${args[0]}`, {code:"asciidoc"});
    // Create a new role with data
    tgtRole = message.guild.createRole({
      name: args[0],
      color: 'DEFAULT',
      mentionable: true,
      hoist: true,
      // create new role at top of server list (below @merging role)
      position: mergingRole.position + 1,
    })
      .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`))
      .catch(console.error)
    // Due to async timing, quit here and advise user to re-run the merge command
    message.channel.send(`Please re-run merge.`, {code:"asciidoc"});
    return;
  }
*/
  if(!tgtRole) {
    message.channel.send(`Creating role ${args[0]}`, {code:"asciidoc"});
    // Create a new role with data
    tgtRole = await message.guild.createRole({
      name: args[0],
      color: 'DEFAULT',
      mentionable: true,
      hoist: true,
      // create new role at top of server list (below @merging role)
      position: mergingRole.position + 1,
    });
    console.log(`Created new role with name ${tgtRole.name} and color ${tgtRole.color}`);
  }

  // does new channel exist?
/*  let newChannel = message.guild.channels.find("name", tgtRole.name);
  // If new channel does not exist, create new channel
  if(!newChannel) {
    // Create new channel
    message.channel.send(`Creating channel ${tgtRole.name}`, {code:"asciidoc"});
    newChannel = message.guild.createChannel(tgtRole.name, 'text', [{
      id: tgtRole.id,
      allow: 0x400,
    },{
      id: adminRole.id,
      allow: 0x10000400,  // manage roles, view channel
    },{
      id: moderatorRole.id,
      allow: 0x400,
    },{
      id: botRole.id,
      allow: 0x10000410,  // manage roles, view channel, manage channels
    },{
      id: everyoneRole.id,
      deny: 0x400,
    }]
      , "merge")
      .then(updated => {
        console.log(updated.permissionOverwrites.get(tgtRole.id));
        updated.setParent(aowChat);
        updated.setPosition(mBulletin.position + 1);
      })
      .catch(console.error);

  } else {
    let i = 0;
    // Overwrite permissions for new role
    newChannel.overwritePermissions(tgtRole, {
//      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
    })
      .then(updated => {
        console.log(updated.permissionOverwrites.get(tgtRole.id));
        updated.setParent(aowChat);
      })
      .catch(console.error);
    newChannel.overwritePermissions(adminRole, {
//      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
    })
      .then(updated => {
        console.log(updated.permissionOverwrites.get(adminRole.id));
      })
      .catch(console.error);
    newChannel.overwritePermissions(moderatorRole, {
//      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
    })
      .then(updated => {
        console.log(updated.permissionOverwrites.get(moderatorRole.id));
      })
      .catch(console.error);
    newChannel.overwritePermissions(botRole, {
//      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
    })
      .then(updated => {
        console.log(updated.permissionOverwrites.get(botRole.id));
      })
      .catch(console.error);

    // Overwrite permissions for a message author
    message.channel.overwritePermissions(everyoneRole, {
      VIEW_CHANNEL: false,
    })
      .then(updated => {
        console.log(updated.permissionOverwrites.get(everyoneRole.id));
      })
      .catch(console.error);
  };
*/

  // for each role listed in message
  args.forEach(function(arg) {
    if(arg !== args[0]) {

      let mRole = message.guild.roles.find("name", arg);
      if(!mRole) {
        message.channel.send(`Role ${arg} does not exist!`, {code:"asciidoc"});
      } else {
        message.channel.send(`Merging ${mRole.name} into ${tgtRole.name}`, {code:"asciidoc"});

        let membersWithRole = mRole.members;
        console.log(`Got ${membersWithRole.size} members with that role.`);

        // give all members the role tgtRole (@merging)
        membersWithRole.forEach(function(mem) {
          mem.addRole(tgtRole)
        });

/*        if(!newChannel) {
          newChannel.then(nc => {
            nc.setParent(aowChat);
            message.channel.send(`New server channel: ${nc.name}`, {code:"asciidoc"});
          });
        }
        else {
          newChannel.setParent(aowChat);
        }
*/
/*
        // archive old channel
        let oldChat = g.channels.find("name", arg);
//        message.channel.send(`Old Chat: ${oldChat.name}`, {code:"asciidoc"});

        if(oldChat) {
//        message.channel.send(`Old Chat: ${oldChat.name}`, {code:"asciidoc"});
//        message.channel.send(`Archive Chat: ${archiveChat.name}`, {code:"asciidoc"});
          oldChat.setParent(archiveChat);
          // final post in old server channel
          oldChat.sendMessage(`Server #${arg} has been merged into Server ${newChannel}! This channel is now set to read-only.`);
          mBulletin.sendMessage(`${mRole} Server #${arg} has been merged into Server ${newChannel}!`);

          // Remove write privileges to old server channel
          message.channel.overwritePermissions(mRole, {
            'SEND_MESSAGES': false,
          })
            .then(updated => {
              console.log(updated.permissionOverwrites.get(mRole.id));
            })
            .catch(console.error);
        }
*/
  }
    };
  });


  message.channel.send(`Merge complete!`, {code:"asciidoc"});
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Admin"
};

exports.help = {
  name: "rerole",
  category: "Admin",
  description: "Remove guild_lang roles",
  usage: "rerole"
};
