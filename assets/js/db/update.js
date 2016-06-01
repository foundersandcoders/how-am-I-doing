/*
* Migrates the database using the data defined in data.questions.json
*/
'use strict'

require('env2')('./config.env')

const Schema = require('../../../server/db/schema.js')()

require('../../../server/db/relations.js')(Schema)

console.log('Arguments: ', process.argv.slice(2))

console.log('Starting update')

Schema.adapter.autoupdate(() => {
  console.log('Update complete')
  console.log('Disconnecting')
  Schema.client.end()
})
