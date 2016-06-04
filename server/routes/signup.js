'use strict'

const Joi = require('joi')
const Boom = require('boom')
const Bcrypt = require('bcrypt')
const Jwt = require('jsonwebtoken')

function encrypt (pw) {
  return Bcrypt.hashSync(pw, 10)
}

exports.register = function (server, options, next) {

  server.route([{
    method: 'GET',
    path: '/signup',
    handler: (request, reply) => {
      reply.view('signup', { heading: 'Sign up', toIndex: true })
    },
    config: { auth: false }
  }, {
    method: 'POST',
    path: '/api/signup',
    handler: function (request, reply) {
      server.app.User.create({
        user_name: request.payload.username,
        user_secret: encrypt(request.payload.password),
        user_email: request.payload.user_email || '',
        clinic_email: request.payload.clinic_email || '',
        clinic_number: request.payload.clinic_number || ''
      }, (err) => {
        if (err)
          return reply(Boom.badImplementation('DB Error'))

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
          confirm_password: Joi.any().valid(Joi.ref('password')).required(),
          user_email: Joi.string().email().allow(''),
          clinic_email: Joi.string().email().allow(''),
          clinic_number: Joi.string().alphanum().allow(''),
          action: Joi.any()
        }
      }
    }
  }])

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'signup'
  }
}
