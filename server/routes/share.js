'use strict'

const Handlebars = require('handlebars')
const util = require('../db/util.js')
const fs = require('fs')
const path = require('path')
const mailgun = require('mailgun-js')({
  apiKey: process.env.API_KEY,
  domain: process.env.MAILGUN_DOMAIN
})

exports.register = function (server, options, next) {

  const Schema = server.app.Schema

  server.route({
    method: 'GET',
    path: '/share/{QUID}',
    handler: (request, reply) => {
      let answers

      util.getAnswersByQuestionnaire(Schema, request.params.QUID)
      .then((results) => {
        answers = results
        const qIDs = answers.map((answer) => answer.question_id)
        return util.getQuestionsById(Schema, qIDs)
      })
      .then((questions) => {
        const fullAnswers = answers.map((answer) => {
          const q = questions.filter((question) => question.id === answer.question_id)
          return {
            question_text: q[0].question_text,
            never: answer.answer === 0,
            sometimes: answer.answer === 1,
            often: answer.answer === 2,
            always: answer.answer === 3
          }
        })

        fs.readFile(path.join(__dirname, '..', '..', 'views', 'mail.html'), (err, contents) => {
          if (err) throw err
          const template = Handlebars.compile(contents.toString())
          const result = template(fullAnswers)
          const data = {
            from: 'Excited User <me@samples.mailgun.org>',
            to: 'tom@foundersandcoders.com',
            subject: 'RCADs',
            text: 'something',
            html: result
          }
          mailgun.messages().send(data, (error, body) => {
            reply({
              success: !error,
              data: body
            })
          })
        })
      })
    }
  })

  server.ext('onRequest', (request, reply) => {
    if (/\/share\/\d+/.test(request.path)) {
      util.isQuestionnaireCompleted(server.app.Schema, request.params.QUID)
        .then((isCompleted) => {
          if (!isCompleted)
            return reply({ success: false })

          return util.isQuestionnaireCreatedByUser(
            server.app.Schema, request.params.QUID, request.auth.credentials.id
          )
        })
        .then((isAuthorised) => {
          if (!isAuthorised)
            return reply.redirect('/questionnaires/history')

          return reply.continue()
        })
    }

    reply.continue()
  })

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'share'
  }
}
