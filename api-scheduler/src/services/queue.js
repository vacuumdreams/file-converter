const EventEmmitter = require("events")
const uuid = require("node-uuid")

class Queue extends EventEmmitter {
  constructor({max}) {
    super()
    this.MAX = max
    this._queue = []
    this._processing = {}

    this.on("add", this._add)
    this.on("process", this._process)
  }

  _add(e) {
    if (typeof e === "function") {
      this._queue.push(e)
      this.emit("process")
    }
  }

  _process() {
    const self = this
    if (this._queue.length > 0 && Object.keys(this._processing).length < this.MAX) {
      const id = uuid.v4()
      const item = this._queue.shift()
      self._processing[id] = item().then(() => {
        delete self._processing[id]
        self.emit("process")
      })
    }
  }

  push(e) {
    this.emit("add", e)
  }
}

module.exports = config => new Queue(config).push
