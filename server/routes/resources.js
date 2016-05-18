'use strict'

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: { path: 'public' }
    }
  })

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'resources'
  }
}
