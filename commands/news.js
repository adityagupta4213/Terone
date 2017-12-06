const config = require('../config.json')
const justGetJSON = require('just-get-json')
const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, [...topic]) => {
  topic = topic.join('%20')
  const apiKey = config.newsApiKey
  const url = `https://newsapi.org/v2/everything?q=${topic}&sortBy=popularity&language=en&apiKey=${apiKey}`
  console.log(url)
  let data
  try {
    data = justGetJSON(url)
  }
  catch (e) {
    message.channel.send(e)
  }

  for (let i = 0; i < 3; i++) {
    message.channel.send({
      embed: {
        color: colors.blue,
        description: `${data.articles[i].title}`,
        author: {
          name: `${data.articles[i].source.name}`
        },
        fields: [{
          'name': 'Author',
          'value': `${data.articles[i].author}`
        }, {
          'name': 'Excerpt',
          'value': `${data.articles[i].description}`
        }, {
          'name': 'URL',
          'value': `${data.articles[i].url}`
        }],
        image: {
          url: `${data.articles[i].urlToImage}`
        },
        footer: {
          text: `Published: ${data.articles[i].publishedAt}`
        }
      }
    })
  }
}
