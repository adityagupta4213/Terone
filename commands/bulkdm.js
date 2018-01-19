const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, args) => {
  if (!message.member.hasPermission(['ADMINISTRATOR'])) {
    return message.channel.send(`${message.author}, **you don't have the required permissions!**`)
  }
  // Declare an empty message array to push the message strings into later on
  let _message = []

  // Untill a word starts with < (mention) or @everyone, keep adding it to the message
  for (let i in args) {
    if (args[i].indexOf('<') === -1 && args[i].indexOf('@') === -1) _message.push(args[i])
  }
  _message = _message.join(' ')

  if (!_message) {
    return message.reply('Please specify a message for sending')
  }

  // Get the snowflake separated
  let users = args.splice(1, args.length)

  // If everyone is mentioned, find every member of the guild and push their user ID to users array
  if (message.mentions.everyone) {
    message.guild.fetchMembers().then(guild => {
      users = guild.members.keyArray()
      sendMsg(users)
    })
  }
  // Only separate IDs from mentions if @everyone is not mentioned
  if (!message.mentions.everyone) {
    for (let i in users) {
      users[i] = users[i].split('').splice(2, users[i].length - 3).join('')
    }
    sendMsg(users)
  }
  // Find every user in the array and sent them the message
  function sendMsg(users) {
    try {
      for (let i in users) {
        bot.fetchUser(users[i]).then(user => {
          user.send({
            embed: {
              color: colors.blue,
              description: `You've received a message from the administrator`,
              author: {
                name: 'DM from Administrator'
              },
              fields: [{
                name: 'Server',
                value: `${message.guild.name}`
              }, {
                name: 'Message',
                value: `${_message}`
              }, {
                name: 'Time',
                value: `${new Date(message.createdTimestamp)}`
              }]
            }
          })
        })
      }
      message.guild.channels.find('name', 'server-log').send({
        embed: {
          color: colors.blue,
          description: `Bulk DM sent successfully`
        }
      })
      message.channel.send({
        embed: {
          color: colors.blue,
          description: `Bulk DM sent successfully`
        }
      })
    }
    catch (e) {
      message.reply(`Couldn't send message due to: ${e}`)
    }
  }
}
