'use strict'

const Handlebars = require('handlebars')
const util = require('../db/util.js')
const fs = require('fs')
const path = require('path')
const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
})

exports.register = function (server, options, next) {

  const Schema = server.app.Schema

  server.route({
    method: 'POST',
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

        Schema.models.User.findById(request.auth.credentials.id, (errDB, user) => {
          if (errDB || !user)
            return reply({ success: false, error: null, body: 'User not found' })

          if (!user.clinic_email)
            return reply({ success: false, error: null, body: 'No clinician email found' })

          fs.readFile(path.join(server.app.DIR_VIEWS, 'mail.html'), (err, contents) => {
            if (err || !contents)
              return reply({ success: false, error: null, body: 'Couldn\'t read e-mail template' })

            const template = Handlebars.compile(contents.toString('utf8'))
            const data = {
              from: user.user_name + ' <' + user.user_email + '>',
              to: user.clinic_email,
              subject: 'RCADS data for ' + user.user_name,
              html: template({ answers: fullAnswers })
            }
            mailgun.messages().send(data, (error, body) => {
              reply({ success: !error, error, body })
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
          if (!isCompleted) {
            return reply({
              success: false,
              error: null,
              body: 'Questionnaire' + request.params.QUID + 'marked completed'
            })
          }

          return util.isQuestionnaireCreatedByUser(
            server.app.Schema, request.params.QUID, request.auth.credentials.id
          )
        })
        .then((isAuthorised) => {
          if (!isAuthorised) {
            return reply({
              success: false,
              error: null,
              body: 'User ' + request.auth.credentials.name +
                    ' does not own questionnaire ' + request.params.QUID
            })
          }

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
