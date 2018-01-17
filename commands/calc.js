const math = require('mathjs')
const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, args) => {
  let result
  try {
    result = math.eval(args)
    if (typeof (result) === NaN) {
      replyErr()
    }
  }
  catch (e) {
    replyErr()
  }

  function replyErr() {
    return message.reply(`Sorry but I can't figure that out`)
  }

  return message.channel.send({
    embed: {
      color: colors.blue,
      description: `The result is ${result}`
    }
  })
}
