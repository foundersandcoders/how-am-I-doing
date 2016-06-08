'use strict'

module.exports = (server) => {
  return {
    index: (opts, cb) => {
      server.inject({
        method: 'GET',
        url: '/'
      }, cb)
    },

    about: (opts, cb) => {
      server.inject({
        method: 'GET',
        url: '/about'
      }, cb)
    },
  }
}
