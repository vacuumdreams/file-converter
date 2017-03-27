const moment = require('moment')
const uuid = require('uuid')
const { merge } = require('angular')

const { EVENTS, STATUS, NOTIFICATION } = require('../constants')

const getConverter = ({vm, scope, type}) => ({
  package: {
    client: undefined,
    service: 'converter',
    task: `to-${type}`,
    method: 'post',
    progress: true,
    data: {
      path: `file://dummy.${type}`,
    },
  },
  text: `New ${type.toUpperCase()} Conversion`,
  disabled: true,
  add: () => {
    if (vm[type].disabled === true) return
    scope.$broadcast(EVENTS.CONVERT.NEW, merge({ id: uuid.v4() }, vm[type].package))
  },
})

function ControllerConvert($scope, ServiceSchedule, ServiceScheduleIO) {
  'ngInject'
  const vm = this

  ServiceScheduleIO.on('id', id => {
    $scope.$broadcast(EVENTS.IO.CONNECT, {id})
  })

  $scope.$on(EVENTS.IO.CONNECT, (e, {id}) => {
    const override = {
      disabled: false,
      package: {
        client: id,
      },
    }
    vm.html = merge({}, vm.html, override)
    vm.pdf = merge({}, vm.pdf, override)
    $scope.$digest()
  })

  $scope.$on(EVENTS.SCHEDULE.SEND.SUCCESS, (e, {id, type, started}) => {
    vm.items.list = [...vm.items.list, {
      id: id,
      title: `${type} #${vm.items.list.filter(item => item.type === type).length + 1}`,
      time: {
        raw: started,
        display: moment(started).format('ddd, MMM D, h:mma'),
      },
      type: type,
      status: STATUS.QUEUED,
      progress: {
        value: 0,
        max: 100,
      },
    }]
  })

  $scope.$on(EVENTS.CONVERT.START, (e, {item}) => {
    item.status = STATUS.STARTED
    vm.notifications.add({
      id: item.id,
      status: item.status,
      message: `Request '${item.title}' started processing`,
      icon: NOTIFICATION.STARTED.icon,
    })
    $scope.$digest()    
  })

  $scope.$on(EVENTS.CONVERT.PROGRESS, (e, {item, value}) => {
    item.progress.value = value
    $scope.$digest()
  })

  $scope.$on(EVENTS.CONVERT.COMPLETE, (e, {item}) => {
    item.status = STATUS.COMPLETE
    vm.notifications.add({
      id: item.id,
      status: item.status,
      message: `Request '${item.title}' processed`,
      icon: NOTIFICATION.COMPLETE.icon,
    })
    $scope.$digest()
  })

  $scope.$on(EVENTS.CONVERT.ERROR, (e, {item}) => {
    item.status = STATUS.ERROR
    vm.notifications.add({
      id: item.id,
      status: item.status,
      message: `Request '${item.title}' failed`,
      icon: NOTIFICATION.ERROR.icon,
    })
    $scope.$digest()
  })

  $scope.$on(EVENTS.CONVERT.NEW, (e, pkg) => {
    let item
    ServiceSchedule.send($scope, pkg)
    ServiceScheduleIO.on(`start-${pkg.id}`, () => {
      item = vm.items.list.find(item => item.id === pkg.id)
      $scope.$broadcast(EVENTS.CONVERT.START, {item}) 
    })
    ServiceScheduleIO.on(`progress-${pkg.id}`, percentage => {
      $scope.$broadcast(EVENTS.CONVERT.PROGRESS, {item, value: percentage}) 
    })
    ServiceScheduleIO.on(`complete-${pkg.id}`, () => {
      $scope.$broadcast(EVENTS.CONVERT.COMPLETE, {item}) 
    })
    ServiceScheduleIO.on(`error-${pkg.id}`, () => {
      $scope.$broadcast(EVENTS.CONVERT.ERROR, {item}) 
    })
  })

  $scope.$on(EVENTS.NOTIFICATION.REMOVE, (e, {id}) => {
    vm.notifications.remove(id)
    $scope.$digest()
  })

  vm.title = 'Conversions'

  vm.items = {
    list: [],
    headers: [
      'Name',
      'Created at',
      'Type',
      'Status',
    ],
  }

  vm.html = getConverter({vm, scope: $scope, type: 'html'})
  vm.pdf = getConverter({vm, scope: $scope, type: 'pdf'})

  vm.notifications = {
    list: [],
    add: item => {
      vm.notifications.list = [item, ...vm.notifications.list]
      $scope.$broadcast(EVENTS.NOTIFICATION.ADD, item)
      if (item.status === STATUS.COMPLETE || item.status === STATUS.ERROR) {
        setTimeout(() => {
          vm.notifivations.remove(item)
        }, 5000)
      }
    },
    remove: item => {
      vm.notifications.list = vm.notifications.list.filter(notification => item.id !== notification.id)
      $scope.$broadcast(EVENTS.NOTIFICATION.REMOVE, item)
    },
  }
}

ControllerConvert.fnname = 'ControllerConvert'
module.exports = ControllerConvert
