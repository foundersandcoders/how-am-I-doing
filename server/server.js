'use strict'
require('env2')('./config.env')

const Hapi = require('hapi')
const Inert = require('inert')
const Vision = require('vision')
const Handlebars = require('handlebars')
const Jwt2 = require('hapi-auth-jwt2')
const path = require('path')

const DB = require('./db/index.js')
const Auth = require('./plugins/auth/index.js')
const httpErrors = require('./plugins/httpErrors/index.js')
const questionnaires = require('./questionnaire/index.js')
const account = require('./account/index.js')

const server = new Hapi.Server({
  connections: {
    router: {
      stripTrailingSlash: true
    }
  }
})

server.app.DIR_ROOT = path.resolve(__dirname, '..')
server.app.DIR_SERVER = __dirname
server.app.DIR_VIEWS = path.resolve(__dirname, '..', 'views')
server.app.DIR_PUBLIC = path.resolve(__dirname, '..', 'public')

const routes = [
  'dashboard',
  'error',
  'home',
  'login',
  'resources',
  'share',
  'signup',
  'visualise',
].map((fname) => path.join(__dirname, 'routes', fname + '.js'))
.map(require)

const plugins = [Inert, Vision, Jwt2, DB, Auth, httpErrors, questionnaires, account].concat(routes)

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
