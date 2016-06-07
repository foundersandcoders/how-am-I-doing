'use strict'

module.exports = {
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: { path: 'public' }
  },
  config: { auth: false }
}
