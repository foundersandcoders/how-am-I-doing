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

const server = new Hapi.Server({
  connections: {
    router: {
      stripTrailingSlash: true
    }
  }
})

const routes = [
  'dashboard',
  'error',
  'home',
  'login',
  'newq',
  'qhistory',
  'resources',
  'share',
  'signup',
  'visualise',
].map((fname) => path.join(__dirname, 'routes', fname + '.js'))
.map(require)

const plugins = [Inert, Vision, Jwt2, DB, Auth, httpErrors, questionnaires].concat(routes)

server.connection({
  port: process.env.PORT || 8000
})

server.register(plugins, (err) => {
  if (err) throw err

  server.views({
    engines: {
      html: Handlebars
    },
    relativeTo: __dirname,
    path: '../views',
    layout: 'default',
    layoutPath: '../views/layouts',
    partialsPath: '../views/partials',
    context: {
      title: 'How Am I Doing?'
    }
  })
})

module.exports = server
