const filepath = `${__dirname}/../data/`

exports.run = (bot, message, args) => {
  if (!message.member.hasPermission(['ADMINISTRATOR'])) {
    return message.reply(`You need to be the administrator of the server to manage my configuration`)
  }
  const config = args[0]
  const value = args.splice(1, args.length - 1)

  try {
    let configFile = require(`./configs/${config}.js`)
    configFile.run(bot, message, filepath, value)
  } catch (err) {
    console.error(err)
  }
}
