const PROCESSTIME = {
  HTML: 10000,
  PDF: 10,
}

const STEPS = 100

module.exports = (type, res) => {
  let track = 0
  const progress = setInterval(() => {
    res.write(`${track++}`)
    if (track === STEPS) {
      clearInterval(progress)
      res.end()
    }
  }, PROCESSTIME[type] / STEPS)
}
