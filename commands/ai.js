const config = require('../config.json')
const apiai = require('apiai')
const app = apiai(config.apiaiToken)
const fs = require('fs')
const DDG = require('node-ddg-api').DDG

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
  // Call the agent
  let request = app.textRequest(`${_message}`, { sessionId: message.author.id })
  request.on('response', function (response) {
    // Set response text equal to the output speech
    let responseText = response.result.fulfillment.speech
    // If response is not available, return default
    if (!responseText) {
      let ddg = new DDG('terone-ddg-search')
      ddg.instantAnswer(_message, {skip_disambig: '0'}, function (err, response) {
        if (err) console.log(err)
        if (response.AbstractText !== '') {
          return message.reply(response.AbstractText)
        } else if (response.RelatedTopics.length > 0) {
          return message.reply(response.RelatedTopics[0].Text)
        } else {
          const responseArray = ['Sorry, I can\'t help you with that', 'IDK', 'No idea about that']
          return message.reply(responseArray[getRandomInt(0, 3)])
        }
      })
    } else {
      return message.reply(`${responseText}`)
    }
  })
  request.on('error', function (error) {
    console.log(error)
  })
  request.end()
}

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min // The maximum is exclusive and the minimum is inclusive
}
