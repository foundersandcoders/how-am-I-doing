'use strict'

// const http = require('https')
const mailgun = require('mailgun-js')({
  apiKey: process.env.API_KEY,
  domain: process.env.MAILGUN_DOMAIN
})

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/share',
    handler: (request, reply) => {
      const data = {
        from: 'Excited User <me@samples.mailgun.org>',
        to: 'tom@foundersandcoders.com',
        subject: 'Hello',
        text: 'Testing some Mailgun awesomness!'
      }
      mailgun.messages().send(data, (error, body) => {
        console.log(body)
      })
      reply.view('share')
    }
  })

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'share'
  }
}
