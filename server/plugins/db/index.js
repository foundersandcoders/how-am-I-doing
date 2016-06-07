'use strict'

exports.register = (server, options, next) => {

  const Schema = require('./schema.js')()

  server.app.Schema = Schema

  require('./relations.js')(Schema)

  Schema.adapter.autoupdate()
  next()
}

exports.register.attributes = {
  pkg: { name: 'models' }
}
