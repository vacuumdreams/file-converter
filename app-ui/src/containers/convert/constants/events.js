module.exports = {
  SCHEDULE: {
    SEND: {
      SUCCESS: 'schedule:send:success',
      ERROR: 'schedule:send:error',
    },
  },
  IO: {
    CONNECT: 'io:connect',
  },
  CONVERT: {
    START: 'convert:start',
    PROGRESS: 'convert:progress',
    COMPLETE: 'convert:complete',
    ABORT: 'convert:abort',
    ERROR: 'convert:error',
    UNSUBSCRIBE: 'convert:unsubscribe',
  },
  ITEM: {
    ADD: 'item:add',
    REMOVE: 'item:remove',
  },
  NOTIFICATION: {
    ADD: 'notification:add',
    REMOVE: 'notification:remove',
  },
}
