module.exports = ({io, queue}) => ({
  io: require("./io")(io),
  queue: require("./queue")(queue),
})
