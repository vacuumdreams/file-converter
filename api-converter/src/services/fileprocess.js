const PROCESSTIME = {
  HTML: 10000,
  PDF: 10,
}

const STEPS = 100

module.exports = (type, writeStream) => {
  let track = 0
  const progress = setInterval(() => {
    writeStream.write(`${track++}`)
    if (track === STEPS) {
      clearInterval(progress)
      writeStream.end()
    }
  }, PROCESSTIME[type] / STEPS)
}
