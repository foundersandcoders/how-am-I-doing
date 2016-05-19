'use strict'

const Caminte = require('caminte')
const Schema = new Caminte.Schema('redis', {
  host: process.env.db_host,
  port: process.env.db_port,
  pool: true
})

exports.register = (server, options, next) => {

  const User = require('./user.js')(Schema)
  const Question = require('./question.js')(Schema)
  const Questionnaire = require('./questionnaire.js')(Schema)
  const Category = require('./category.js')(Schema)

  server.app.Schema = Schema
  server.app.User = User
  server.app.Question = Question
  server.app.Questionnaire = Questionnaire
  server.app.Category = Category

  User.hasMany(Questionnaire, { as: 'questionnaire', foreignKey: 'user_id' })
  Questionnaire.belongsTo(User, { as: 'user', foreignKey: 'questionnaire_id' })
  Category.hasMany(Question, { as: 'question', foreignKey: 'cat_id' })
  Question.belongsTo(Category, { as: 'category', foreignKey: 'question_id' })
  Questionnaire.hasMany(Category, { as: 'category', foreignKey: 'questionnaire_id' })

  next()
}

exports.register.attributes = {
  pkg: { name: 'models' }
}
