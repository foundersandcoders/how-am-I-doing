'use strict'

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/visualise',
    handler: (request, reply) => {
      reply.view('visualise', {
        heading: 'Visualise',
        scripts: [
          'http://d3js.org/d3.v3.min.js',
          'https://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js',
          '/js/visualise.js',
        ]
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
