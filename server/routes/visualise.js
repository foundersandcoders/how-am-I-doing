'use strict'

const Boom = require('boom')

exports.register = function (server, options, next) {

  const Schema = server.app.Schema

  server.route({
    method: 'GET',
    path: '/visualise',
    handler: (request, reply) => {
      Schema.models.Category.all((err, categories) => {
        if (err)
          return reply(Boom.badImplementation('DB error', err))

        reply.view('visualise', {
          heading: 'Visualise',
          categories: categories,
          scripts: [
            'https://d3js.org/d3.v3.min.js',
            '/js/visualise.base.js',
            '/js/visualise.barchart.js',
            '/js/visualise.linechart.js',
            '/js/visualise.table.js',
            '/js/visualise.js'
          ]
        })
      })
    }
  })
  next()
}

exports.register.attributes = {
  pkg: {
    name: 'visualise'
  }
}
