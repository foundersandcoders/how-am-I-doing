'use strict'

module.exports = (server, header) => {
  return {
    get: {
      new: (opts, cb) => {
        server.inject({
          method: 'GET',
          url: '/questionnaires/new',
          headers: header,
        }, cb)
      },

      questions: (opts, cb) => {
        const defaults = { QUID: 1 }
        const options = Object.assign({}, defaults, opts)

        server.inject({
          method: 'GET',
          url: '/questionnaires/' + options.QUID + '/questions',
          headers: header
        }, cb)
      },

      summary: (opts, cb) => {
        const defaults = { QUID: 1 }
        const options = Object.assign({}, defaults, opts)

        server.inject({
          method: 'GET',
          url: '/questionnaires/' + options.QUID + '/summary',
          headers: header
        }, cb)
      },
    },

    post: {
      register: (opts, cb) => {
        const defaults = {}
        const payload = Object.assign({}, defaults, opts)

        server.inject({
          method: 'POST',
          url: '/questionnaires/new/register',
          headers: header,
          payload: payload,
        }, cb)
      },

      answer: (opts, cb) => {
        const QUID = opts.QUID ? opts.QUID : 1
        delete opts.QUID

        const defaults = {}
        const payload = Object.assign({}, defaults, opts)

        server.inject({
          method: 'POST',
          url: '/questionnaires/' + QUID + '/answers',
          headers: header,
          payload: payload,
        }, cb)
      },

      complete: (opts, cb) => {
        const QUID = opts.QUID ? opts.QUID : 1
        delete opts.QUID

        server.inject({
          method: 'POST',
          url: '/questionnaires/' + QUID + '/complete',
          header: header,
        }, cb)
      }
    }
  }
}
