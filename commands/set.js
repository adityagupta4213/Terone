const filepath = `${__dirname}/../data/`

exports.run = (bot, message, args) => {
  if (!message.member.hasPermission(['ADMINISTRATOR'])) {
    return message.reply(`You don't have required permissions to manage my configuration`)
  }
  const config = args[0]
  const value = args.splice(1, args.length - 1)

  try {
    let configFile = require(`./configs/${config}.js`)
    configFile.run(bot, message, filepath, value)
  } catch (err) {
    console.error(err)
  }

  /*
  for (let i in data) {
    if (data.hasOwnProperty(property)) {
      data[i] = value
    }
  }
  fs.writeFile(`${filepath}${guild.id}.json`, JSON.stringify(data), err => {
    if (!err) message.reply(`${property} was successfully set to ${value}`)
  }) */
}
