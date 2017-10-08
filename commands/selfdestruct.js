const config = require('../config.json')
exports.run = (bot, message, [reason]) => {
  let isStaff = false
  if (!reason) reason = 'No specified reason'
  for (let i in config.staff) {
    if (message.author.id === config.staff[i].userID) {
      isStaff = true
      break
    }
  }
  console.log(isStaff)
  if (isStaff) {
    message.channel.send(`Self desctruction initiated. Terone will now be removed from this server due to: **${reason}**`)
    message.guild.leave()
  } else {
    message.reply('**This command can only be executed by my staff**')
  }
}
