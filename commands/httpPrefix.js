//
// HTTP auto prefixing
//
exports.run = (bot, message) => {
  // If message has 'www.' and does not have 'http', push it to the url array
  let url = []
  // If multiword sentence, split words else don't
  let _message = message.content.split(' ')
  if (!_message) {
    url.push(message.content)
  }
  for (let i in _message) {
    if (_message[i].indexOf('www') !== -1 && _message[i].indexOf('http') === -1) {
      console.log(_message[i])
      url.push(message[i])
    }
  }

  // If the url array is not empty
  if (url[0]) {
    console.log(url)
    message.channel.send(`Looks like you made a typo in the URL ${message.author}. No issues, here are the corrected ones:`)
    for (let i in url) {
      message.channel.send(`http://${url[i]}`)
    }
  }
}
