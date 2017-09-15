//
// Server count as current game
//
exports.run = (bot) => {
  console.log('Online!')
  bot.user.setPresence({ game: { name: `on ${bot.guilds.size} servers`, type: 0 } })
}
