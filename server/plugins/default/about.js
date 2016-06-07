'use strict'

module.exports = {
  method: 'GET',
  path: '/about',
  handler: (request, reply) => {
    reply.view('about', { heading: 'About' })
  },
  config: { auth: false }
}
