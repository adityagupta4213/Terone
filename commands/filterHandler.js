const fs = require('fs')
exports.run = (bot, message) => {
  let settings
  try {
    settings = JSON.parse(fs.readFileSync(`./data/${message.guild.id}.json`, 'utf8'))
  }
  catch (e) {
    console.log(e)
  }
  if (!settings) {
    return
  }

  const filterInviteChannels = settings.filterinvites
  if (filterInviteChannels) {
    let discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i
    try {
      for (let i in filterInviteChannels) {
        // Check if channel is in filter invites array and message is an invite
        if (message.channel.id === filterInviteChannels[i] && discordInvite.test(message.content)) {
          message.delete()
          return message.reply('This channel does not allow sending invites')
        }
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  // Same as above
  const filterLinkChannels = settings.filterlinks
  if (filterLinkChannels) {
    try {
      let links = message.content.match(/(http[s]?:\/\/)[(www\.)]?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi)
      for (let i in filterLinkChannels) {
        if (message.channel.id === filterLinkChannels[i]) {
          if (links) {
            message.delete()
            return message.reply('This channel does not allow sending links')
          }
        }
      }
    }
    catch (e) {
      console.log(e)
    }
  }
}
