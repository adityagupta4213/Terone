const help = require('../help.json')
const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, helpFor) => {
  helpFor = helpFor.join(' ')
  if (!helpFor) {
    let fields = []
    for (let i in help) {
      fields.push({
        name: `${parseInt(i) + parseInt(1)}. ${help[i].name}`,
        value: `${help[i].description}
                \nSyntax: \`\`\`${help[i].syntax}\`\`\` Example: \`\`\`${help[i].example}\`\`\`
               `
      })
    }
    message.author.send({
      embed: {
        color: colors.blue,
        description: `Here's the command guide\n\n`,
        author: {
          name: `COMMAND GUIDE`
        },
        fields: fields
      }
    }).then(
        message.channel.send({
          embed: {
            color: colors.blue,
            description: `${message.author}, have a look at your inbox.`
          }
        })
      ).catch(e => { return message.reply(`Couldn't complete the operation due to ${e}`) })
  }
  if (helpFor) {
    for (let i in help) {
      if (help[i].command === helpFor) {
        message.channel.send({
          embed: {
            color: colors.blue,
            description: `${help[i].description}`,
            author: {
              name: `${help[i].name}`
            },
            fields: [
              {
                'name': 'Syntax',
                'value': `\`\`\`${help[i].syntax}\`\`\``
              },
              {
                'name': 'Example',
                'value': `\`\`\`${help[i].example}\`\`\``
              }
            ]
          }
        })
        break
      }
    }
  }
}
