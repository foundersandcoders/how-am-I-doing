'use strict'

const Hapi = require('hapi')
const Inert = require('inert')
const Vision = require('vision')
const Handlebars = require('Handlebars')

//Route plugins
const Home = require('./routes/home')

const server = new Hapi.Server()

const plugins = [Inert, Vision, Home]

server.connection({
  port: process.env.PORT || 8000
})

server.register(plugins, (err) => {
  if (err) console.log('err--->', err)
  server.views({
    engines: {
      html: Handlebars
    },
    relativeTo: __dirname,
    path: '../public/views',
    layout: 'default',
    layoutPath: '../public/views/layouts',
    partialsPath: '../public/views/partials'
  })
})

module.exports = server
