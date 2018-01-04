exports.run = (bot, message, args) => {
  if (!message.member.hasPermission(['ADMINISTRATOR'])) {
    return message.reply(`You need to be the administrator of the server to manage my configuration`)
  }
  const config = args[0]
  args = args.splice(1, args.length)
  const filepath = `${__dirname}/../data/`
  try {
    let configFile = require(`./ignConfigs/${config}.js`)
    configFile.run(bot, message, filepath, args)
  } catch (err) {
    console.error(err)
  }
}
