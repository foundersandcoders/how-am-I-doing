'use strict'

const https = require('https')

exports.register = (server, options, next) => {

  if (process.env.NODE_ENV === 'production') {
    setInterval(() => {
      https.get('https://howamidoing.herokuapp.com')
    }, 1000 * 60 * 5) // every 5 minutes
  }

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'noIdle'
  }
}
