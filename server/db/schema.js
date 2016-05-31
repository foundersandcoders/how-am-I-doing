'use strict'

const Caminte = require('caminte')

let connection

if (process.env.ENV_PRODUCTION === 'true') {
  connection = {
    url: process.env.DATABASE_URL + '?ssl=true'
  }

} else {
  connection = {
    host: 'localhost',
    port: 5432,
    pool: true,
    database: 'test'
  }

}

module.exports = () => {
  const Schema = new Caminte.Schema(process.env.DB_DRIVER, connection)

  require('./models/user.js')(Schema)
  require('./models/question.js')(Schema)
  require('./models/questionnaire.js')(Schema)
  require('./models/category.js')(Schema)
  require('./models/questionnaireAnswers.js')(Schema)
  require('./models/questionnaireCategories.js')(Schema)

  Schema.adapter.dropAllTables = function (cb) {
    let wait = 0

    Object.keys(this._models).forEach((model) => {
      wait++
      this.dropTable(model, (err) => {
        if (err)
          console.log(err)

        done()
      })

      if (wait === 0 && cb)
        cb()

      const done = () => {
        if (--wait === 0 && cb)
          cb()
      }
    })
  }

  Schema.adapter.flushAll = function (cb) {
    let wait = 0

    Object.keys(this._models).forEach((model) => {
      wait++
      this.destroyAll(model, (err) => {
        if (err)
          console.log(err)

        done()
      })

      if (wait === 0 && cb)
        cb()

      const done = () => {
        if (--wait === 0 && cb)
          cb()
      }
    })
  }

  return Schema
}
