const fs = require('fs')
const config = require('../config.json')
const staff = config.staff
const _colors = require('../colors.json')
const filepath = `${__dirname}/../data/`
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, args) => {
  if (!message.member.hasPermission(['ADMINISTRATOR'])) {
    return message.reply('Only the administrators can request support from officials')
  }
  const data = JSON.parse(fs.readFileSync(`./data/${message.guild.id}.json`, 'utf8'))
  const leastTime = 1000 * 60 * 3 // 3 mins

  console.log(data)

  if (!data.contactedSupportTimestamp || message.createdTimestamp - data.contactedSupportTimestamp > leastTime) {
    console.log(!data.contactedSuppportTimestamp)

    data.contactedSupportTimestamp = message.createdTimestamp

    fs.writeFile(`${filepath}${message.guild.id}.json`, JSON.stringify(data), err => {
      console.log(err)
    })

    message.channel.createInvite({
      maxAge: 0
    }).then((invite) => {
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
              fields: [{
                'name': 'Name',
                'value': `${message.author.username}`
              }, {
                'name': 'Server',
                'value': `${message.guild.name}`
              }, {
                'name': 'Invite',
                'value': `${invite}`
              }]
            }
          })
        })
      }
    })
    message.reply(`I've requested my staff to attend your issue. To canel the request, type ++cancelsupport.`)
  }
  else {
    return message.reply('You need to wait at least 3 minutes before sending a support request again')
  }
}
