'use strict'

const Bcrypt = require('bcrypt')


exports.register = (server, options, next) => {
  const validate = (decoded, request, callback) => {
    debugger
    server.app.User.findOne({ where: { user_name: decoded.username }, order: 'user_name' }, (err, user) => {
      console.log('err--->', err, 'user--->', user)
      if (!user) return callback(null, false)

      if (err) return callback(err)

      Bcrypt.compare(decoded.password, user.user_secret, (error, isValid) => {
        callback(error, isValid, { id: user.user_id, name: user.user_name })
      })
    })
  }
  server.auth.strategy('strategy-jwt', 'jwt',
  { key: process.env.JWT_KEY,
    validateFunc: validate,
    verifyOptions: { algorithms: ['HS256'] }
  })

  server.auth.default('strategy-jwt')
  next()
}

exports.register.attributes = {
  pkg: {
    name: 'auth'
  }
}
