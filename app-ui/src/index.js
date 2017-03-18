const uuid = require('node-uuid')
const moment = require('moment')
const io = require('socket.io-client')

const angular = require('angular') 
require('angular-route')

const events = {
  SCHEDULE: {
    SEND: {
      SUCCESS: 'schedule:send:success',
    },
  },
  IO: {
    CONNECT: 'io:connect',
  },
}

function ControllerSchedule($scope, ServiceSchedule, ServiceScheduleIO) {
  const vm = this

  vm.title = 'Conversions'

  ServiceScheduleIO.on('id', id => {
    console.log('client created: ' + id)
    $scope.$broadcast(events.IO.CONNECT, id)
  })

  // setTimeout(() => console.log(vm), 3000)

  $scope.$on(events.IO.CONNECT, (e, id) => {
    console.log('ID: ' + id)
    vm.html.update({
      disabled: true,
    })
    vm.pdf.update({
      disabled: true,
    })

    // vm.html = angular.merge(vm.html, {
    //   client: id,
    //   disabled: false,
    //   package: {
    //     progress: true,
    //   },
    // })
    // vm.pdf = angular.merge(vm.pdf, {
    //   client: id,
    //   disabled: false,
    //   package: {
    //     progress: true,
    //   },
    // })
  })

  vm.list = {
    header: [
      'Name',
      'Created at',
      'Type',
      'Status',
    ],
    items: [],
    add: $scope.$on(events.SCHEDULE.SEND.SUCCESS, (e, res) => {
      console.log('ONSEND: ', res)
      vm.list.items.push({
        id: res.id,
        title: `${res.type} #${vm.list.items.filter(item => item.type === res.type).length + 1}`,
        time: {
          raw: res.started,
          display: moment(res.started).format('LLLL'),
        },
        type: res.type,
        statusText: 'In Queue',
        progress: {
          value: 0,
          max: 100,
        },
      })
    }),
  }

  vm.html = {
    package: {
      client: undefined,
      service: 'converter',
      task: 'to-html',
      method: 'post',
      progress: true,
      data: {
        path: 'file://dummy.html',
      },
    },
    text: 'New HTML Conversion',
    disabled: false,
    add: () => {
      const id = uuid.v4()
      ServiceSchedule.send($scope, angular.merge({ id }, vm.html.package))
      ServiceScheduleIO.on(`start-${id}`, () => console.log('STARTED!'))
      ServiceScheduleIO.on(`progress-${id}`, percentage => {
        console.log(vm.list.items.find(item => item.id === id).progress.value)
        vm.list.items.find(item => item.id === id).progress.value = parseInt(percentage)
        console.log('PERCENTAGE: ' + percentage)
      })
      ServiceScheduleIO.on(`complete-${id}`, () => console.log('COMPLETED!'))
      ServiceScheduleIO.on(`error-${id}`, error => console.log('ERROR: ', error))
    },
    update: obj => angular.merge(vm.html, obj),
  }
  vm.pdf = {
    package: {
      client: undefined,
      service: 'converter',
      task: 'to-pdf',
      method: 'post',
      progress: true,
      data: {
        path: 'file://dummy.pdf',
      },
    },
    disabled: false,
    text: 'New PDF Conversion',
    add: () => {
      const id = uuid.v4()
      ServiceSchedule.send($scope, angular.merge({ id }, vm.pdf.package))
      ServiceScheduleIO.on(`start-${id}`, () => console.log('STARTED!'))
      ServiceScheduleIO.on(`progress-${id}`, percentage => {
        console.log(vm.list.items)
        vm.list.items.find(item => item.id === id).progress.value = percentage
        console.log('PERCENTAGE: ' + percentage)
      })
      ServiceScheduleIO.on(`complete-${id}`, () => console.log('COMPLETED!'))
      ServiceScheduleIO.on(`error-${id}`, error => console.log('ERROR: ', error))
    },
    update: obj => angular.merge(vm.pdf, obj),
  }
}

function ServiceSchedule($http) { 
  return ({
    send: (scope, pkg) => $http.post('http://localhost:8020/schedule', pkg)
      .then(res => {
        scope.$broadcast(events.SCHEDULE.SEND.SUCCESS, res.data.data)
      }),
  })
}

function ServiceScheduleIO() {
  const socket = io('http://localhost:8021')
  return ({
    emit: socket.emit.bind(socket),
    on: socket.on.bind(socket),
  })
}

angular.module('app', [
  'ngRoute',
  'app.convert', // <- TODO: location check for defining the right module dependency on init
])
.config(['$routeProvider', $routeProvider => {
  $routeProvider.when('/', {
    templateUrl: 'containers/convert.html',
    controller: 'ControllerSchedule',
    controllerAs: 'vm',
  })
}])
.config(['$httpProvider', $httpProvider => {
  $httpProvider.defaults.headers.common['Content-type'] = 'application/json'
}])
.directive('iconSprite', () => ({
  scope: {},
  templateUrl: 'presentation/icon-sprite.html',
}))
.directive('icon', () => ({
  scope: {
    name: '@',
  },
  template: `
    <svg viewBox="0 0 100 100" class="icon icon-{{name}}">
      <use xlink:href="#clock"></use>
    </svg>
  `,
}))
.directive('formButton', () => ({ 
  restrict: 'E',
  scope: {
    onSubmit: '&',
    onUpdate: '&',
    disabled: '<',
    text: '@', 
  },
  templateUrl: 'presentation/form-button.html',
}))

angular.module('app.convert', [])
.factory('ServiceSchedule', ServiceSchedule)
.factory('ServiceScheduleIO', ServiceScheduleIO)
.controller('ControllerSchedule', ControllerSchedule)
.directive('itemList', () => ({
  restrict: 'E',
  scope: {
    list: '<',
  },
  templateUrl: 'presentation/item-list.html',
}))
