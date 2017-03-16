module.exports = config => (type, progressWriteStream) => {
  let track = 0
  const progress = setInterval(() => {
    track += 1
    progressWriteStream.write(`${track}`)
    if (track === config.STEPS) {
      progressWriteStream.end()
      clearInterval(progress)
    }
  }, config.TIME[type] / config.STEPS)
}
