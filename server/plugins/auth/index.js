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

  const routes = [
    'login',
    'signup',
    'api/login',
    'api/signup',
    'api/logout',
  ].map((route) => require('./' + route + '.js')(server))

  server.route(routes)

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'auth'
  }
}
