module.exports = ({app, routes}) => {
  app.config(["$routeProvider", $routeProvider => {
    Object.keys(routes).map(location => {
      $routeProvider.when(location, {
        templateUrl: routes[location].view,
        controller: routes[location].actions,
      })
    })
  }])
}
