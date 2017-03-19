const { EVENTS } = require('../constants') 

module.exports = function ServiceSchedule($http) { 
  return ({
    send: (scope, pkg) => $http.post('http://localhost:8020/schedule', pkg)
      .then(res => {
        scope.$broadcast(EVENTS.SCHEDULE.SEND.SUCCESS, res.data.data)
      }),
  })
}
