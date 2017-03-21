const EventEmmitter = require('events')
const uuid = require('node-uuid')

class Queue extends EventEmmitter {
  constructor({max}) {
    super()
    this.MAX = max
    this._queue = []
    this._processing = {}

    this.on('add', this._add)
    this.on('process', this._process)
  }

  _add(e) {
    if (typeof e === 'function') {
      this._queue.push(e)
      this.emit('process')
    }
  }

  _process() {
    const self = this
    if (self._queue.length > 0 && Object.keys(self._processing).length < self.MAX) {
      const id = uuid.v4()
      const item = self._queue.shift()
      self._processing[id] = item().then(res => {
        res.on('end', () => {
          delete self._processing[id]
          self.emit('process')
        })
      })
    }
  }

  push(e) {
    this.emit('add', e)
  }
}

module.exports = config => {
  const q = new Queue(config)
  return q.push.bind(q)
}
