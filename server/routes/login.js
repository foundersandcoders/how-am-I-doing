'use strict'

const validator = require('../plugins/auth/validate.js')
const Jwt = require('jsonwebtoken')
const Joi = require('joi')


exports.register = function (server, options, next) {

  server.route([
    {
      method: 'GET',
      path: '/login',
      handler: (request, reply) => {
        if (! request.state.token)
          return reply.view('login')

        const validate = validator(server)
        const isVerified = Jwt.verify(request.state.token, process.env.JWT_KEY)

        if (isVerified) {
          const decoded = Jwt.decode(request.state.token)
          validate(decoded, request, (err, isValid) => {
            if (err || !isValid)
              return reply.view('login').unstate('token')

            return reply.redirect('/dashboard')
          })
        } else {
          return reply.view('login').unstate('token')
        }
      },
      config: { auth: false }
    }, {
      method: 'POST',
      path: '/api/login',
      handler: (request, reply) => {
        const validate = validator(server)

        validate({
          username: request.payload.username,
          password: request.payload.password,
        }, request, (err, isValid) => {
          if (err || !isValid)
            return reply.redirect('/login')

          const token = Jwt.sign({
            username: request.payload.username,
            password: request.payload.password
          }, process.env.JWT_KEY)

          reply.redirect('/dashboard').state('token', token)
        })
      },
      config: {
        auth: false,
        validate: {
          payload: {
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
            action: Joi.any()
          }
        }
      }
    }, {
      method: 'GET',
      path: '/api/logout',
      handler: (request, reply) => {
        return reply.redirect('/').unstate('token')
      }
    }
  ])

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'login'
  }
}
