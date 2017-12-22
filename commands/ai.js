const config = require('../config.json')
const apiai = require('apiai')
const app = apiai(config.apiaiToken)
const fs = require('fs')

exports.run = (bot, message) => {
  let settings
  try {
    settings = JSON.parse(fs.readFileSync(`./data/${message.guild.id}.json`, 'utf8'))
  } catch (e) {
    console.log(e)
  }
  if (!settings) {
    return
  }

  if (message.content.indexOf('prefix') !== -1) {
    return message.reply(`The current prefix is: **${settings.prefix}**`)
  }
  // Remove the bot mention from the message
  let _message = message.content.split(' ').slice(1).join(' ')
  // Generate a random session ID
  let randomID = Math.floor(Math.random() * 9999)
  // Call the agent
  let request = app.textRequest(`${_message}`, { sessionId: randomID })

  request.on('response', function (response) {
    // Set response text equal to the output speech
    let responseText = response.result.fulfillment.speech
    // If response is not available, return default
    if (!responseText) {
      message.reply(`I'm afraid I don't have a reply to that. I'm trying to get better every day though`)
    } else {
      message.reply(`${responseText}`)
    }
  })

  request.on('error', function (error) {
    console.log(error)
  })
  request.end()
}
