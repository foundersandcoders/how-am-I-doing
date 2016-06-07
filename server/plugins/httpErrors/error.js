'use strict'

module.exports = {
  method: 'GET',
  path: '/error/{code}',
  handler: (request, reply) => {
    const opts = {
      toLogin: ['400', '401', '403'].indexOf(request.params.code) > -1,
      notFound: ['404'].indexOf(request.params.code) > -1,
      isLoggedIn: request.auth.isAuthenticated,
      errorName: JSON.stringify(request.params),
      statusCode: request.params.code
    }
    reply.view('error', opts).code(+request.params.code)
  },
  config: { auth: false }
}
