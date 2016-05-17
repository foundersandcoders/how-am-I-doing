exports.register = function(server, options, next) {

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply.view('index')
    }
  })
  next()
}

exports.register.attributes = {
  name: 'home'
}
