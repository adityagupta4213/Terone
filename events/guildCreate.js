const fs = require('fs')

exports.run = (bot, guild) => {
  const fs = require('fs')
  const _colors = require('../colors.json')
  const config = require('../config.json')
  const requiredChannels = config.requiredChannels
  // Change string values to int from colors.json
  const colors = {}
  Object.keys(_colors).forEach(function (key) {
    let value = _colors[key]
    colors[key] = parseInt(value)
  })

  const initialData = {
    'prefix': '++',
    'serverlog': 'false',
    'memberlog': 'false',
    'welcomechannel': 'welcome',
    'filterinvites': ['none'],
    'filterlinks': ['none']
  }

  exports.run = (bot, message, args) => {
    const guild = message.guild
    bot.channels.find('id', config.teroneLog).send({
      embed: {
        color: colors.blue,
        description: `Terone is now a member of **${guild.name}**`,
        thumbnail: {
          url: guild.iconURL
        },
        author: {
          name: 'SERVER JOINED'
        },
        fields: [{
          'name': 'Owner',
          'value': `${guild.owner}`
        }, {
          'name': 'Server Region',
          'value': `${guild.region}`
        }, {
          'name': 'Joined at',
          'value': `${guild.joinedAt}`
        }, {
          'name': 'Members',
          'value': `${guild.memberCount}`
        }]
      }
    })

    fs.writeFile(`./data/${guild.id}.json`, JSON.stringify(initialData), err => {
      console.log(err)
    })

    try {
      let didInit = true
      for (let i in requiredChannels) {
        if (!guild.channels.exists('name', requiredChannels[i])) {
          try {
            guild.createChannel(requiredChannels[i], 'text')
            didInit = true
          } catch (e) {
            console.log(e)
            didInit = false
          }
        }
      }
      if (didInit) {
        return guild.channels.find('name', 'general').send(`The server has been reinitialize. Use the \`settings\` command to view settings`)
      } else {
        // If automatic initialization failed
        return guild.channels.find('name', 'general').send({
          embed: {
            color: colors.red,
            description: '**Automatic initialization failed. Please provide me administrative permissions and run the following command.**',
            author: {
              name: 'INITIALIZATION ERROR'
            },
            fields: [{
              'name': 'Command',
              'value': '++init'
            }, {
              'name': 'Explanation',
              'value': 'Type the above command in order to perform a crucial initialization process of creating some required channels.'
            }]
          }
        })
      }
    } catch (e) {
      guild.channels.find('name', 'general').send(`Automatic initialization failed. Please check if I have required permissions and run the \`++init\` command. Error: ${e}`)
    }
  }
}
