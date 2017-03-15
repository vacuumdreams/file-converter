const angular = require('angular')
const route = require('angular-route')

const ConvertController = function (ServiceConvert) {
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
        path: 'file://dummy.html'
      },
    },
    text: 'New HTML Conversion',
    add: () => ServiceConvert.send(vm.html.package).then(vm.add),
  }
  vm.pdf = {
    package: {
      service: 'converter',
      task: 'to-pdf',
      method: 'post',
      data: {
        path: 'file://dummy.pdf'
      },
    },
    text: 'New PDF Conversion',
    add: () => ServiceConvert.send(vm.pdf.package).then(vm.add),
  }
}

angular.module('app', [
  'ngRoute',
  // 'ngView',
  'app.convert',
])
.config(['$routeProvider', $routeProvider => {
  $routeProvider.when('/', {
    templateUrl: 'containers/convert.html',
    controller: 'ConvertController',
    controllerAs: 'vm',
  })
}])

angular.module('app.convert', [])
.factory('ServiceConvert', $http => ({
  send: package => $http.post('http://localhost:8020/schedule', package)
    .then(res => {
      console.log(res)
    })
}))
.controller('ConvertController', ConvertController)
.directive('formButton', () => ({ scope: { props: '=' }, templateUrl: 'presentation/form-button.html' }))
.directive('itemList', () => ({ scope: { list: '=' }, templateUrl: 'presentation/item-list.html' }))


