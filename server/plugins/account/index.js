'use strict'

exports.register = function (server, options, next) {

  const routes = [
    'api',
    'info',
  ].map((el) => require('./' + el + '.js')(server.app.Schema))

  server.route(routes)

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'account'
  }
}
