'use strict'

const validator = require('./validate.js')
const jwt = require('jsonwebtoken')

module.exports = (Schema) => {
  return {
    method: 'GET',
    path: '/login',
    handler: (request, reply) => {
      if (! request.state.token)
        return reply.view('login')

      const validate = validator(Schema)
      const isVerified = jwt.verify(request.state.token, process.env.JWT_KEY)

      if (! isVerified)
        return reply.view('login').unstate('token')

      const decoded = jwt.decode(request.state.token)
      validate(decoded, request, (err, isValid) => {
        if (err || !isValid)
          return reply.view('login').unstate('token')

        return reply.redirect('/dashboard')
      })
    },
    config: { auth: false }
  }
}
