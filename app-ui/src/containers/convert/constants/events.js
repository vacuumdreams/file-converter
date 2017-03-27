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
    NEW: 'convert:new',
    START: 'convert:start',
    PROGRESS: 'convert:progress',
    COMPLETE: 'convert:complete',
    ERROR: 'convert:error',
  },
  NOTIFICATION: {
    ADD: 'notification:add',
    REMOVE: 'notification:remove',
  },
}
