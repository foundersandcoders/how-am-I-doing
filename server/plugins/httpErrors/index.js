'use strict'

exports.register = (server, options, next) => {

  server.ext('onPreResponse', (request, reply) => {

    if (request.response.isBoom) {
      console.log('Error detected: ', request.response, 'Redirecting to /error')
      return reply.redirect('/error/' + request.response.output.statusCode)
    }

    reply.continue()

  })

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'HTTP Errors'
  }
}
