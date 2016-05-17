"use strict"

const Hapi = require('hapi')
const Inert = require('inert')
const Vision = require('vision')
const Handlebars = require('Handlebars')

const server = new Hapi.Server()

const plugins = [Inert, Vision]


server.connection({
    port: process.env.PORT || 8000
})

server.register(plugins, function(err) {
  if(err){
    console.log('err--->', err)
  }
})


module.exports = server;
