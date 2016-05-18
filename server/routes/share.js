exports.register = function(server, options, next) {

  server.route({
    method: 'GET',
    path: '/share',
    handler: (request, reply) => {
      reply.view('share')
    }
  })
  next()
}

exports.register.attributes = {
  name: 'share'
}
