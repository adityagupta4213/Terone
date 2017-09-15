const config = require('../config.json')
const justGetJSON = require('just-get-json')
const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, [city, unit]) => {
  if (!city) {
    return message.channel.send('**Please provide a valid city name along with preferred temperature unit (celsius/fahrenheit) in the syntax: <city>, <country> <unit></unit>**')
  }
  // Keep a variable for displaying unit in results
  const _unit = unit.toUpperCase()
  // Set unit as metric or imperial
  unit = unit.toUpperCase() === 'C' ? 'metric' : 'imperial'

  const appID = config.appID
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${appID}`
  let data

  try {
    data = justGetJSON(url)
  } catch (e) {
    message.channel.send(e)
  }

  if (!data.name) {
    return message.reply(`**Enter a valid city name please!**`)
  }
  const cityName = data.name
  const countryCode = data.sys.country
  const temp = data.main.temp
  const condition = data.weather[0].main
  const humidity = data.main.humidity

  message.channel.send({
    embed: {
      color: colors.blue,
      description: `Here are the weather conditions for **${cityName}, ${countryCode}**`,
      author: {
        name: 'WEATHER'
      },
      fields: [
        {
          'name': 'Temperature',
          'value': `${temp}°${_unit}`
        },
        {
          'name': 'Sky',
          'value': `${condition}`
        },
        {
          'name': 'Humidity',
          'value': `${humidity}`
        }
      ]
    }
  })
}
