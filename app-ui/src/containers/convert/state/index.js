const moment = require('moment')
const uuid = require('uuid')
const { merge } = require('angular')

const { EVENTS, STATUS, NOTIFICATION } = require('../constants')

const getConverter = ({type}) => ({
  pkg: {
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
})

function ControllerConvert($scope, ServiceSchedule, ServiceScheduleIO, localStorageService) {
  'ngInject'
  const vm = this

  ServiceScheduleIO.on('id', id => {
    $scope.$broadcast(EVENTS.IO.CONNECT, {id})
  })

  $scope.$on(EVENTS.IO.CONNECT, (e, {id}) => {
    const override = {
      disabled: false,
      pkg: {
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
    $scope.$broadcast(EVENTS.NOTIFICATION.ADD, {
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
    $scope.$broadcast(EVENTS.NOTIFICATION.ADD, {
      id: item.id,
      status: item.status,
      message: `Request '${item.title}' processed`,
      icon: NOTIFICATION.COMPLETE.icon,
    })
    $scope.$digest()
  })

  $scope.$on(EVENTS.CONVERT.ERROR, (e, {item}) => {
    item.status = STATUS.ERROR
    $scope.$broadcast(EVENTS.NOTIFICATION.ADD, {
      id: item.id,
      status: item.status,
      message: `Request '${item.title}' failed`,
      icon: NOTIFICATION.ERROR.icon,
    })
    $scope.$digest()
  })

  $scope.$on(EVENTS.CONVERT.ADD, (e, {pkg, disabled}) => {
    let item
    if (disabled === true) return
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
      localStorageService.set('items', vm.items.list)
    })
    ServiceScheduleIO.on(`error-${pkg.id}`, () => {
      $scope.$broadcast(EVENTS.CONVERT.ERROR, {item}) 
    })
  })

  $scope.$on(EVENTS.CONVERT.REMOVE, (e, {id}) => {
    vm.items.list = vm.items.list.filter(item => item.id !== id)
    localStorageService.set('items', vm.items.list)
  }) 

  $scope.$on(EVENTS.NOTIFICATION.ADD, (e, item) => {
    vm.notifications.list = [item, ...vm.notifications.list]
    $scope.$digest()
    if (item.status === STATUS.COMPLETE || item.status === STATUS.ERROR) {
      setTimeout(() => {
        $scope.$broadcast(EVENTS.NOTIFICATION.REMOVE, item)
      }, 5000)
    }
  })

  $scope.$on(EVENTS.NOTIFICATION.REMOVE, (e, item) => {
    vm.notifications.list = vm.notifications.list.filter(notification => item.id !== notification.id)
    $scope.$digest()
  })

  vm.title = 'Conversions'

  vm.items = {
    list: localStorageService.get('items') || [],
    headers: [
      'Name',
      'Created at',
      'Type',
      'Status',
    ],
    add: type => {
      $scope.$broadcast(EVENTS.CONVERT.ADD, {
        pkg: merge({id: uuid.v4()}, vm[type].pkg),
        disabled: vm[type].disabled,
      })
    },
    remove: item => {
      console.log('REMOVE', item)
      $scope.$broadcast(EVENTS.CONVERT.REMOVE, item)
    },
  }

  vm.html = getConverter({type: 'html'})
  vm.pdf = getConverter({type: 'pdf'})

  vm.notifications = {
    list: [],
  }
}

ControllerConvert.fnname = 'ControllerConvert'
module.exports = ControllerConvert
