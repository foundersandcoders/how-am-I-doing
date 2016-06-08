'use strict'

module.exports = (server) => {
  return {
    signup: (opts, cb) => {
      const defaults = {
        username: 'tom',
        password: 'apples123',
        confirm_password: 'apples123',
        user_email: 'example@test.com',
      }

      const payload = Object.assign({}, defaults, opts)

      server.inject({
        method: 'POST',
        url: '/api/signup',
        payload: payload
      }, cb)
    },

    login: (opts, cb) => {
      const defaults = {
        username: 'tom',
        password: 'apples123',
      }

      const payload = Object.assign({}, defaults, opts)

      server.inject({
        method: 'POST',
        url: '/api/login',
        payload: payload
      }, cb)
    }
  }
}
