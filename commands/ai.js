const config = require('../config.json')
const apiai = require('apiai')
const app = apiai(config.apiaiToken)

exports.run = (bot, message) => {
  // Remove the bot mention from the message
  let _message = message.content.split(' ').slice(1).join(' ')
  // Generate a random session ID
  let randomID = Math.floor(Math.random() * 9999)
  // Call the agent
  let request = app.textRequest(`${_message}`, { sessionId: randomID })

  request.on('response', function (response) {
    // Log all responses.
    console.log(response)
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
