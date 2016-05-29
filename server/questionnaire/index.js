'use strict'

exports.register = function (server, options, next) {

  const routes = [
    'history',
    'new',
    'new.register',
    'quid.answers',
    'quid.complete',
    'quid.questions',
    'quid.summary',
    'single',
  ].map((el) => require('./' + el + '.js')(server.app.Schema))

  server.route(routes)

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'questionnaires'
  }
}
