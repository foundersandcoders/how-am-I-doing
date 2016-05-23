'use strict'

const Caminte = require('caminte')
const Schema = new Caminte.Schema(process.env.DB_DRIVER, {
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  pool: true,
  database: process.env.DB_NUMBER
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
