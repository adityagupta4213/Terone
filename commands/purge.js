//
// Remove all messages from all users in the channel, up to 100.
//
exports.run = (bot, message, [deleteCount]) => {
  if (!message.member.hasPermission(['MANAGE_MESSAGES'])) {
    return message.channel.send(`${message.author} Don't try to remove evidence :D ! You don't have the permissions to manage messages`)
  }

  if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
    return message.reply('Please provide a number between 2 and 100 for the number of messages to delete')
  }
  // Get messages and delete them
  message.channel.fetchMessages({ limit: deleteCount })
    .then(messages => message.channel.bulkDelete(messages))
    .catch(error => message.reply(`Couldn't delete messages because of: ${error}`))
}
