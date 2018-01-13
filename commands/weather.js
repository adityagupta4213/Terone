const config = require('../config.json')
const justGetJSON = require('just-get-json')
const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, [...city]) => {
  if (!city) {
    return message.reply('Please provide a valid city name')
  }
  city = city.join(' ')

  // Just for fun
  if (city.toLowerCase() === 'devrant') {
    return message.reply(`Slightly cloudy with a chance of bugs`)
  } else if (city.toLowerCase() === 'terone') {
    return message.reply(`Beware! Terone's way too hot!`)
  }
  const appID = config.appID
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${appID}`
  let data

  try {
    data = justGetJSON(url)
  } catch (e) {
    return message.reply(`Couldn't find the city. Please check for any mis-spellings.`)
  }
  console.log(data)
  if (!data.name) {
    return message.reply(`Couldn't find your city. Please check for any mis-spellings.`)
  }
  const cityName = data.name
  const countryCode = data.sys.country
  const temp = data.main.temp
  const condition = data.weather[0].main
  const humidity = data.main.humidity
  const tempFahrenheit = convertCtoF(temp)

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
          'value': `${temp}°C\n\n${tempFahrenheit}°F`
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

function convertCtoF (temp) {
  return parseInt(temp) * (9 / 5) + 32).toFixed(1)
}
