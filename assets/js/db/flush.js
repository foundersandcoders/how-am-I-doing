/*
* Flushes the database
*/
'use strict'

require('env2')('./config.env')

const flush = module.exports = (cb) => {
  const Schema = require('../../../server/db/schema.js')()
  const s = Schema.settings

  console.log('Flushing all table rows from ', s.host + ':' + s.port + '/' + s.database)

  Schema.adapter.flushAll(() => {
    console.log('Tables rows flushed successfully')
    console.log('Disconnecting')
    Schema.client.end()
    if (cb)
      cb()
  })
}

if (require.main === module)
  flush()
