const moment = require('moment')
const uuid = require('uuid')
const { merge } = require('angular')

const { EVENTS, STATUS, NOTIFICATION } = require('../constants')

const getItem = (vm, scope, type) => ({
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
  update: obj => merge(vm[type], obj),
})

function ControllerConvert($scope, ServiceSchedule, ServiceScheduleIO) {
  'ngInject'
  const vm = this

  ServiceScheduleIO.on('id', id => {
    $scope.$broadcast(EVENTS.IO.CONNECT, id)
  })

  $scope.$on(EVENTS.IO.CONNECT, (e, id) => {
    const override = {
      disabled: false,
      package: {
        client: id,
      },
    }
    vm.html.update(override)
    vm.pdf.update(override)
    $scope.$digest()
  })

  $scope.$on(EVENTS.SCHEDULE.SEND.SUCCESS, (e, res) => {
    vm.list.items = [...vm.list.items, {
      id: res.id,
      title: `${res.type} #${vm.list.items.filter(item => item.type === res.type).length + 1}`,
      time: {
        raw: res.started,
        display: moment(res.started).format('ddd, MMM D, h:mma'),
      },
      type: res.type,
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

  $scope.$on(EVENTS.CONVERT.ERROR, (e, item) => {
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
      item = vm.list.items.find(item => item.id === pkg.id)
      $scope.$broadcast(EVENTS.CONVERT.START, {item}) 
    })
    ServiceScheduleIO.on(`progress-${pkg.id}`, percentage => {
      $scope.$broadcast(EVENTS.CONVERT.PROGRESS, {item, value: percentage}) 
    })
    ServiceScheduleIO.on(`complete-${pkg.id}`, () => {
      $scope.$broadcast(EVENTS.CONVERT.COMPLETE, {item}) 
    })
    ServiceScheduleIO.on(`error-${pkg.id}`, () => {
      $scope.$broadcast(EVENTS.CONVERT.COMPLETE, {item}) 
    })
  })

  $scope.$on(EVENTS.NOTIFICATION.REMOVE, (e, {id}) => {
    setTimeout(() => {
      vm.notifications.prepare(id, ['removing'])
      $scope.$digest()
    }, 200)
    setTimeout(() => {
      vm.notifications.remove(id)
      $scope.$digest()
    }, 10000)
  })

  vm.title = 'Conversions'

  vm.list = {
    header: [
      'Name',
      'Created at',
      'Type',
      'Status',
    ],
    items: [],
  }

  vm.html = getItem(vm, $scope, 'html')
  vm.pdf = getItem(vm, $scope, 'pdf')

  vm.notifications = {
    class: '',
    list: [],
    add: item => {
      vm.notifications.class = 'notification-adding'
      vm.notifications.list = [item, ...vm.notifications.list]
      if (item.status === STATUS.COMPLETE || item.status === STATUS.ERROR) {
        $scope.$broadcast(EVENTS.NOTIFICATION.REMOVE, item)
      }
    },
    prepare: (id, classes) => {
      vm.notifications.list = vm.notifications.list.map(notification => {
        return notification.id !== id ? notification : merge(notification, { class: classes.map(c => `notification-${c}`).join(' ') })
      })
    },
    remove: id => {
      vm.notifications.list = vm.notifications.list.filter(notification => id !== notification.id)
    },
  }
}

ControllerConvert.fnname = 'ControllerConvert'
module.exports = ControllerConvert
