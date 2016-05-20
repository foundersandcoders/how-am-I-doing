'use strict'

const Hapi = require('hapi')
const Inert = require('inert')
const Vision = require('vision')
const Handlebars = require('handlebars')
const Jwt2 = require('hapi-auth-jwt2')
const path = require('path')
const Models = require('./models/index.js')
const Auth = require('./plugins/auth.js')

const server = new Hapi.Server()

const routes = [
  'account',
  'dashboard',
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

const plugins = [Inert, Vision, Models, Jwt2, Auth].concat(routes)

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
    path: '../public/views',
    layout: 'default',
    layoutPath: '../public/views/layouts',
    partialsPath: '../public/views/partials',
    context: {
      title: 'How Am I Doing?'
    }
  })
})

module.exports = server
