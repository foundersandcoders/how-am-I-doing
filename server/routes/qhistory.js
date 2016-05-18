exports.register = function(server, options, next) {

  server.route({
    method: 'GET',
    path: '/qhistory',
    handler: (request, reply) => {
      reply.view('qhistory')
    }
  })
  next()
}

exports.register.attributes = {
  name: 'qhistory'
}
