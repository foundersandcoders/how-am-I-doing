'use strict'

module.exports = (schema) => {
  return schema.define('user', {
    user_name: { type: schema.String, index: true, unique: true },
    user_email: { type: schema.String },
    user_secret: { type: schema.String },
    clinic_email: { type: schema.String },
    clinic_number: { type: schema.String }
  },
  { primaryKeys: ['user_id'] })
}
