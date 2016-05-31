'use strict'

module.exports = (schema) => {
  return schema.define('User', {
    user_name: { type: schema.String, unique: true },
    user_email: { type: schema.String },
    user_secret: { type: schema.String },
    clinic_email: { type: schema.String },
    clinic_number: { type: schema.String }
  })
}
