'use strict'

module.exports = (schema) => {
  return schema.define('category', {
    cat_id: { type: schema.Number, unique: true },
    cat_name: { type: schema.String },
    cat_long_name: { type: schema.String },
  },
  { primaryKeys: ['cat_id'] })
}
