module.exports = config => (type, writeStream) => {
  let track = 0
  const progress = setInterval(() => {
    writeStream.write(`${track++}`)
    if (track === config.STEPS) {
      clearInterval(progress)
      writeStream.end()
    }
  }, config.TIME[type] / config.STEPS)
}
