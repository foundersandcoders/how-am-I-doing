'use strict'

const Bcrypt = require('bcrypt')
const Boom = require('boom')
const Joi = require('joi')
const jwt = require('jsonwebtoken')

function encrypt (pw) {
  return Bcrypt.hashSync(pw, 10)
}

module.exports = (server) => {
  return {
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

        const token = jwt.sign(request.payload, process.env.JWT_KEY)

        reply.redirect('/dashboard').state('token', token)
      })
    },
    config: {
      auth: false,
      validate: {
        payload: {
          username: Joi.string().alphanum().min(3).max(30).required(),
          password: Joi.string().regex(/^.{8,}$/).required(),
          confirm_password: Joi.any().valid(Joi.ref('password')).required(),
          user_email: Joi.string().email().allow(''),
          clinic_email: Joi.string().email().allow(''),
          clinic_number: Joi.string().alphanum().allow(''),
          action: Joi.any()
        }
      }
    }
  }
}
