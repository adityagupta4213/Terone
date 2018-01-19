const fs = require('fs')

exports.run = (bot, message, filepath, [value]) => {
  const guild = message.guild
  let data = JSON.parse(fs.readFileSync(`${filepath}${guild.id}.json`, 'utf8'))
  if (!value || (value !== 'true' && value !== 'false')) { return message.reply(`Please specify a value either as \`true\` or \`false\`. For more info, use the help command\n \`\`\`${data.prefix}help autowelcome\`\`\``) }

  data.autowelcome = value

  fs.writeFile(`${filepath}${guild.id}.json`, JSON.stringify(data), err => {
    if (!err) message.reply(`**Automatic Welcome** was successfully set to **${value}**`)
  })
}
