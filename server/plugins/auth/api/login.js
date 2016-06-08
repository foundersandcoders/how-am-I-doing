'use strict'

const Joi = require('joi')
const jwt = require('jsonwebtoken')
const validator = require('../validate.js')

module.exports = (Schema) => {
  return {
    method: 'POST',
    path: '/api/login',
    handler: (request, reply) => {
      const validate = validator(Schema)

      validate(request.payload, request, (err, isValid) => {
        if (err || !isValid) {
          return reply.redirect('/login', {
            error: err ? 'Validation error' : 'Invalid credentials'
          })
        }

        const token = jwt.sign({
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
          password: Joi.string().regex(/^.{8,}$/).required(),
          action: Joi.any()
        }
      }
    }
  }
}
