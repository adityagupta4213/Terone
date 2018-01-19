const translate = require('google-translate-api')
const isoConv = require('iso-language-converter')
const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, args) => {
  // Capitalize first letter in order to be able to work with isoConv
  let fromLang = args[0]
  let toLang = args[1]
  toLang = toLang.toLowerCase().split('')
  toLang[0] = toLang[0].toUpperCase()
  toLang = toLang.join('')

  let string = args.splice(2, args.length - 1)
  string = string.join(' ')
  // Convert given language to appropriate ISO code
  let targetLang = isoConv(toLang)

  if (!fromLang) {
    fromLang = 'auto'
  }

  if (!string) {
    return message.reply('Umm....what exactly do I translate? Run ```++help translate``` to know the correct syntax')
  }

  // Compatiblity issue with Chinese b/w isoConv and the translation API
  targetLang = targetLang === 'zh' ? 'zh-cn' : targetLang

  translate(string, { from: fromLang, to: targetLang }).then(result => {
    if (result.from.text.autoCorrected) {
      message.channel.send(`The text was corrected to: ${result.from.text.value}`)
    }
    message.channel.send({
      embed: {
        color: colors.blue,
        description: `**Translation from** __${isoConv(result.from.language.iso)}__:   ${result.text}`,
        thumbnail: {
          url: 'http://res.cloudinary.com/daemonad/image/upload/v1504465478/Paomedia-Small-N-Flat-Globe_z01tid.png'
        },
        author: {
          name: 'TRANSLATOR'
        }
      }
    })
  }).catch(err => {
    message.channel.send(`An error occured while attempting to translate ${err}`)
  })
}
