'use strict'

module.exports = (server, header) => {
  if (! header) {
    return {
      auth: helpers.auth(server),
      public: helpers.public(server),
    }
  } else {
    return {
      auth: helpers.auth(server),
      public: helpers.public(server),
      questionnaire: helpers.questionnaire(server, header),
      account: helpers.account(server, header),
      share: helpers.share(server, header),
    }
  }
}

const helpers = {}

helpers.auth = (server) => {
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

helpers.questionnaire = (server, header) => {
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
        const defaults = {}
        const options = Object.assign({}, defaults, opts)

        server.inject({
          method: 'GET',
          url: '/questionnaires/' + options.QUID + '/questions',
          headers: header
        }, cb)
      },

      summary: (opts, cb) => {
        const defaults = {}
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
        if (!opts.QUID)
          throw new Error('QUID must be passed in opts object')

        const QUID = opts.QUID
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
        if (!opts.QUID)
          throw new Error('QUID must be passed in opts object')

        const QUID = opts.QUID
        delete opts.QUID

        server.inject({
          method: 'POST',
          url: '/questionnaires/' + QUID + '/complete',
          headers: header,
        }, cb)
      }
    }
  }
}

helpers.public = (server) => {
  return {
    index: (opts, cb) => {
      server.inject({
        method: 'GET',
        url: '/',
      }, cb)
    },

    about: (opts, cb) => {
      server.inject({
        method: 'GET',
        url: '/about',
      }, cb)
    },
  }
}

helpers.share = (server, header) => {
  return (opts, cb) => {
    server.inject({
      method: 'POST',
      url: '/share/' + opts.QUID,
      headers: header,
    }, cb)
  }
}

helpers.account = (server, header) => {
  return (opts, cb) => {
    server.inject({
      method: 'POST',
      url: '/api/user',
      headers: header,
      payload: opts,
    }, cb)
  }
}
