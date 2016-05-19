'use strict'

module.exports = (schema) => {
  return schema.define('user', {
    user_id: { type: schema.Number },
    user_name: { type: schema.String },
    user_email: { type: schema.String },
    user_secret: { type: schema.String },
    clinic_email: { type: schema.String },
    clinic_number: { type: schema.String }
  },
  { primaryKeys: ['user_id'] })
}
