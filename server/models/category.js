'use strict'

module.exports = (schema) => {
  return schema.define('category', {
    cat_id: { type: schema.Number },
    cat_name: { type: schema.String }
  },
  { primaryKeys: ['cat_id'] })
}
