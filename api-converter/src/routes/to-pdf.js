module.exports = (config, fileprocess) => ({
  post: (req, res) => fileprocess('PDF', res),
})
