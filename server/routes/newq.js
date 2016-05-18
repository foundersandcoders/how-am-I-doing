exports.register = function(server, options, next) {

  server.route({
    method: 'GET',
    path: '/newq',
    handler: (request, reply) => {
      reply.view('newq')
    }
  })
  next()
}

exports.register.attributes = {
  name: 'newq'
}
