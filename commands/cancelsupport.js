const config = require('../config.json')
const staff = config.staff
const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message) => {
  for (let i in staff) {
    bot.fetchUser(staff[i].userID).then((user) => {
      // Send support request
      user.send({
        embed: {
          color: colors.blue,
          description: `A user has cancelled staff support request`,
          author: {
            name: `SUPPORT REQUEST CANCELLED`
          },
          fields: [
            {
              'name': 'Name',
              'value': `${message.author}`
            },
            {
              'name': 'Server',
              'value': `${message.guild.name}`
            }
          ]
        }
      })
    })
  }
  message.channel.send(`${message.author} Your request has been cancelled`)
}
