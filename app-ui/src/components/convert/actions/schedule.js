const { EVENTS } = require('../constants') 

function ServiceSchedule($http) { 
  'ngInject'
  return ({
    send: (scope, pkg) => $http.post('http://localhost:8020/schedule', pkg)
      .then(res => {
        scope.$broadcast(EVENTS.SCHEDULE.SEND.SUCCESS, res.data.data)
      })
      .catch(err => {
        scope.$broadcast(EVENTS.SCHEDULE.SEND.ERROR, err)
      }),
  })
}

ServiceSchedule.fnname = 'ServiceSchedule'
module.exports = ServiceSchedule
