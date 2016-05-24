'use strict'

exports.register = (server, options, next) => {

  const Schema = require('./schema.js')()

  server.app.Schema = Schema
  server.app.User = server.app.Schema.models.User
  server.app.Question = server.app.Schema.models.Question
  server.app.Questionnaire = server.app.Schema.models.Questionnaire
  server.app.Category = server.app.Schema.models.Category

  require('./relations.js')(Schema)

  next()
}

exports.register.attributes = {
  pkg: { name: 'models' }
}
