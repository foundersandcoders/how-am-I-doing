'use strict'

exports.register = (server, options, next) => {

  const routes = [
    'home',
    'about',
    'dashboard',
    'resources',
  ].map((route) => require('./' + route + '.js'))

  server.route(routes)

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'Default'
  }
}
