'use strict'

const Caminte = require('caminte')

module.exports = () => {
  const Schema = new Caminte.Schema(process.env.DB_DRIVER, {
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    pool: true,
    database: process.env.DB_NUMBER
  })

  require('./models/user.js')(Schema)
  require('./models/question.js')(Schema)
  require('./models/questionnaire.js')(Schema)
  require('./models/category.js')(Schema)

  return Schema
}
