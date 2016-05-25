'use strict'

const Caminte = require('caminte')

module.exports = () => {
  const Schema = new Caminte.Schema(process.env.DB_DRIVER, {
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    pool: true,
    database: process.env.DB_NAME
  })

  require('./models/user.js')(Schema)
  require('./models/question.js')(Schema)
  // require('./models/questionnaire.js')(Schema)
  require('./models/category.js')(Schema)

  Schema.adapter.dropAllTables = function (cb) {
    let wait = 0

    Object.keys(this._models).forEach((model) => {
      wait++
      this.dropTable(model, (err) => {
        if (err)
          throw err

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
          throw err

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
