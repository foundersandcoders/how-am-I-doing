'use strict'

exports.register = (server, options, next) => {

  const Schema = require('./schema.js')()

  server.app.Schema = Schema
  server.app.User = server.app.Schema.models.User
  server.app.Question = server.app.Schema.models.Question
  server.app.Questionnaire = server.app.Schema.models.Questionnaire
  server.app.Category = server.app.Schema.models.Category
  server.app.QuestionnaireAnswers = server.app.Schema.models.QuestionnaireAnswers
  server.app.QuestionnaireCategories = server.app.Schema.models.QuestionnaireCategories

  require('./relations.js')(Schema)

  Schema.adapter.autoupdate()
  next()
}

exports.register.attributes = {
  pkg: { name: 'models' }
}
