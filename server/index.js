'use strict'

require('env2')('./config.env')
const server = require('./server.js')


server.start((err) => {
  if (err) throw err
  console.log('Server is running at: ', server.info.uri)
})
