const angular = require('angular')
require('angular-route')
require('angular-animate')
require('angular-local-storage')

const directiveTypeMap = {
  'string': '@',
  'boolean': '<',
  'array': '<',
  'function': '&',
}

const addDirectives = (moduleName, directives) => {
  Object.keys(directives).map(key => {
    const directive = directives[key]
    const scope = {}
    Object.keys(directive.variables).map(varName => {
      scope[varName] = directiveTypeMap[directive.variables[varName].type]
    })

    angular.module(moduleName)
    .directive(key, () => ({
      restrict: 'E',
      transclude: true,
      templateUrl: `presentation/${directive.template}`,
      scope,
    }))
  })
}

const addFactories = (moduleName, factories) => {
  Object.keys(factories).map(key => {
    const factory = factories[key]
    angular.module(moduleName)
    .factory(factory.fnname, factory)
  })
}

module.exports = ({ main, components }) => {

  angular.module(main.name, [
    'ngRoute',
    'ngAnimate',
    'LocalStorageModule',
    main.routes[window.location.pathname].name,
  ])
  .config(['$httpProvider', $httpProvider => {
    $httpProvider.defaults.headers.common['Content-type'] = 'application/json'
  }])
  .config(['localStorageServiceProvider', localStorageServiceProvider => {
    localStorageServiceProvider
      .setPrefix('app-ui')
      .setNotify(false, false)
  }])
  .config(['$routeProvider', $routeProvider => {
    Object.keys(main.routes).map(key => {
      const route = main.routes[key]
      $routeProvider.when(key, {
        templateUrl: `containers/${route.template}`,
        controller: route.state.fnname,
        controllerAs: 'vm',
      })
    })
  }])

  addDirectives(main.name, main.views)
  addFactories(main.name, main.actions)

  Object.keys(components).map(key => {
    const component = components[key]
    angular.module(component.name, [])
    addDirectives(component.name, component.views)
    addFactories(component.name, component.actions)
    
    angular.module(component.name).controller(component.state.fnname, component.state)
  })
}
