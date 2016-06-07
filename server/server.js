'use strict'
require('env2')('./config.env')

const Hapi = require('hapi')
const Handlebars = require('handlebars')
const path = require('path')
const load = require('modload')

const server = new Hapi.Server({
  connections: {
    router: {
      stripTrailingSlash: true
    }
  }
})

server.app.DIR_ROOT = path.resolve(__dirname, '..')
server.app.DIR_SERVER = __dirname
server.app.DIR_PLUGINS = path.resolve(__dirname, 'plugins')
server.app.DIR_VIEWS = path.resolve(__dirname, '..', 'views')
server.app.DIR_PUBLIC = path.resolve(__dirname, '..', 'public')

const preload = load.asArray({
  dir: server.app.DIR_PLUGINS,
  include: /db/,
  stopfile: /index.js/,
  modules: [
    'inert',
    'vision',
    'hapi-auth-jwt2',
  ]
})

const postload = load.asArray({
  dir: server.app.DIR_PLUGINS,
  exclude: /db/,
  stopfile: /index.js/
})

const plugins = preload.concat(postload)

server.connection({
  port: process.env.PORT || 8000
})

server.register(plugins, (err) => {
  if (err) throw err

  server.views({
    engines: {
      html: Handlebars
    },
    relativeTo: server.app.DIR_ROOT,
    path: 'views',
    layout: 'default',
    layoutPath: path.join(server.app.DIR_VIEWS, 'layouts'),
    partialsPath: path.join(server.app.DIR_VIEWS, 'partials'),
    context: {
      title: 'How Am I Doing?'
    }
  })
})

module.exports = server
