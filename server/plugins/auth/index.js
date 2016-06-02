'use strict'

const validate = require('./validate.js')

exports.register = (server, options, next) => {
  const validator = validate(server.app.Schema)

  server.auth.strategy('strategy-jwt', 'jwt', {
    key: process.env.JWT_KEY,
    validateFunc: validator,
    verifyOptions: { algorithms: ['HS256'] }
  })

  server.auth.default('strategy-jwt')

  server.state('token', {
    ttl: null, // Session cookie (deleted when browser closed)
    isSecure: process.env.NODE_ENV === 'production',
    isHttpOnly: true,
    domain: process.env.DOMAIN,
    encoding: 'none',
    clearInvalid: true,
    strictHeader: true,
    path: '/'
  })

  server.ext('onRequest', (request, reply) => {
    if (process.env.NODE_ENV === 'production') {
      const httpOrigin = request.headers.origin
      const httpForward = request.headers['x-forwarded-proto']

      if (httpForward && httpForward === 'http')
        return reply.redirect('https://' + request.headers.host + request.url.path)

      if (httpOrigin && httpOrigin.search('http://') === 0)
        return reply.redirect('https://' + request.headers.host + request.url.path)
    }

    reply.continue()
  })

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'auth'
  }
}
