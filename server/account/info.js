'use strict'

module.exports = (Schema) => {
  return {
    method: 'GET',
    path: '/account',
    handler: (request, reply) => {
      Schema.models.User.findById(request.auth.credentials.id, (err, user) => {
        if (err || !user)
          return reply.redirect('/login')

        reply.view('account', {
          user,
          heading: 'My Account',
          scripts: ['/js/account.js']
        })
      })
    }
  }
}
