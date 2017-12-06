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
  const content = message.content.toLowerCase().split(' ').join('')
  let isLink = false 
  let isFilter = false
  if (filterInviteChannels) {
    try {
      for (let i in filterInviteChannels) {
        // Check if channel is in filter invites array and message is an invite
        if (message.channel.id === filterInviteChannels[i] && content.indexOf('https://discord.gg/') !== -1) {
          message.delete()
	  isFilter = true
	}
      }
      if (isFilter) 
	return message.reply('This channel does not allow sending invites')
    }
    catch (e) {
      console.log(e)
    }
  }

  // Same as above
  const filterLinkChannels = settings.filterlinks
  if (filterLinkChannels) {
    try {
      for (let i in filterLinkChannels) {
        if (message.channel.id === filterLinkChannels[i] && content.indexOf('http') !== -1 || content.indexOf('www') !== -1) {
          message.delete()   
	  isLink = true       
        }
      }
      if (isLink) 
	return message.reply('This channel does not allow sending invites')

    }
    catch (e) {
      console.log(e)
    }
  }
}
