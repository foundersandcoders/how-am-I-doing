'use strict'

const Joi = require('joi')
const Boom = require('boom')

module.exports = (Schema) => {
  return {
    method: 'POST',
    path: '/api/user',
    handler: (request, reply) => {
      const fields = [
        'user_name',
        'user_email',
        'clinic_email',
        'clinic_number',
        'delete'
      ]

      const data = fields.reduce((acc, f) => {
        acc[f] = request.payload[f]
        return acc
      }, {})

      if (data.delete) {
        Schema.models.User.remove({
          where: { id: request.auth.credentials.id }
        }, (err) => {
          if (err)
            return reply(Boom.badImplementation('DB Error', err))

          reply.redirect('/').unstate('token')
        })
      } else {
        Schema.models.User.update({
          id: request.auth.credentials.id
        }, data, (err, user) => {
          if (err || !user)
            return reply(Boom.badImplementation('DB Error', err))

          reply.redirect('/account')
        })
      }
    },
    config: {
      validate: {
        payload: {
          user_name: Joi.string().alphanum().min(3).max(30),
          confirm_user_name: Joi.any().valid(Joi.ref('user_name')),
          user_email: Joi.string().email(),
          confirm_user_email: Joi.any().valid(Joi.ref('user_email')),
          clinic_email: Joi.string().email(),
          confirm_clinic_email: Joi.any().valid(Joi.ref('clinic_email')),
          clinic_number: Joi.string().alphanum(),
          confirm_clinic_number: Joi.any().valid(Joi.ref('clinic_number')),
          action: Joi.any(),
          submit: Joi.any()
        }
      }
    }
  }
}
