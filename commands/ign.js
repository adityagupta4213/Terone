exports.run = (bot, message, args) => {
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
