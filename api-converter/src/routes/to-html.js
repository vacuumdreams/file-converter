module.exports = (config, fileprocess) => ({
  post: (req, res) => fileprocess('HTML', res),
})
