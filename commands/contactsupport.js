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
  message.channel.createInvite({ maxAge: 0 }).then((invite) => {
    for (let i in staff) {
      bot.fetchUser(staff[i].userID).then((user) => {
        // Send support request
        user.send({
          embed: {
            color: colors.blue,
            description: `A user has requested staff support`,
            author: {
              name: `SUPPORT REQUEST`
            },
            fields: [
              {
                'name': 'Name',
                'value': `${message.author}`
              },
              {
                'name': 'Server',
                'value': `${message.guild.name}`
              },
              {
                'name': 'Invite',
                'value': `${invite}`
              }
            ]
          }
        })
      })
    }
  })
  message.channel.send(`I've requested my staff to attend your issue. To canel the request, type ++cancelsupport.`)
}
