'use strict'

const Joi = require('joi')
const Boom = require('boom')
const Bcrypt = require('bcrypt')

function encrypt (pw) {
  return Bcrypt.hashSync(pw, 10)
}

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/signup',
    handler: (request, reply) => {
      reply.view('signup')
    }
  })
  server.route({
    method: 'POST',
    path: '/api/signup',
    handler: function (request, reply) {
      server.app.User.create({
        user_name: request.payload.username,
        user_secret: encrypt(request.payload.password),
        user_email: request.payload.user_email,
        clinic_email: request.payload.clinic_email,
        clinic_number: request.payload.clinic_number
      }, (err) => {
        if (err)
          return reply(Boom.badImplementation('DB Error'))

        reply.redirect('/dashboard')
      })
    },
    config: {
      validate: {
        payload: {
          username: Joi.string().alphanum().min(3).max(30).required(),
          password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
          confirm_pasword: Joi.any().valid(Joi.ref('password')).required(),
          user_email: Joi.string().email().required(),
          clinic_email: Joi.string().email().required(),
          clinic_number: Joi.string().alphanum().required()
        }
      }
    }
  })
  next()
}

exports.register.attributes = {
  pkg: {
    name: 'signup'
  }
}
