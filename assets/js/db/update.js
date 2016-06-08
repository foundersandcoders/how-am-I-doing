/*
* Migrates the database using the data defined in data.questions.json
*/
'use strict'

require('env2')('./config.env')

console.log('Arguments: ', process.argv.slice(2))

const update = module.exports = function (cb) {
  console.log('Starting update')

  const Schema = require('../../../server/db/schema.js')()
  require('../../../server/db/relations.js')(Schema)

  Schema.adapter.autoupdate(() => {
    console.log('Update complete')
    console.log('Disconnecting')
    Schema.client.end()
    if (cb)
      cb()
  })
}

if (require.main === module)
  update()
