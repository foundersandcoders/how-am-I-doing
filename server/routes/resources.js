'use strict'

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: { path: 'public' }
    },
    config: { auth: false }
  })

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'resources'
  }
}
