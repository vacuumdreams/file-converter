const uuid = require('node-uuid')
const angular = require('angular') 
require('angular-route')

function ConvertController(ServiceSchedule) {
  const vm = this

  vm.title = 'Conversions'

  vm.list = {
    header: [
      'Name',
      'Created at',
      'Type',
      'Status',
    ],
    items: [],
    add: item => vm.list.items.push(item),
  }

  vm.html = {
    package: {
      service: 'converter',
      task: 'to-html',
      method: 'post',
      data: {
        path: 'file://dummy.html',
      },
    },
    text: 'New HTML Conversion',
    add: () => ServiceSchedule.send(angular.merge({ id: uuid.v4() }, vm.html.package)).then(vm.add),
  }
  vm.pdf = {
    package: {
      service: 'converter',
      task: 'to-pdf',
      method: 'post',
      data: {
        path: 'file://dummy.pdf',
      },
    },
    text: 'New PDF Conversion',
    add: () => ServiceSchedule.send(angular.merge({ id: uuid.v4() }, vm.pdf.package)).then(vm.add),
  }
}

function SreviceSchedule($http) { 
  return ({
    send: pkg => $http.post('http://localhost:8020/schedule', pkg)
      .then(res => {
        console.log(res)
      }),
  })
}

angular.module('app', [
  'ngRoute',
  'app.convert',
])
.config(['$routeProvider', $routeProvider => {
  $routeProvider.when('/', {
    templateUrl: 'containers/convert.html',
    controller: 'ConvertController',
    controllerAs: 'vm',
  })
}])
.config(['$httpProvider', $httpProvider => {
  $httpProvider.defaults.headers.common['Content-type'] = 'application/json'
}])

angular.module('app.convert', [])
.factory('ServiceSchedule', SreviceSchedule)
.controller('ConvertController', ConvertController)
.directive('formButton', () => ({ scope: { props: '=' }, templateUrl: 'presentation/form-button.html' }))
.directive('itemList', () => ({ scope: { list: '=' }, templateUrl: 'presentation/item-list.html' }))


