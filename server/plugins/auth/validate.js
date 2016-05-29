'use strict'
const Bcrypt = require('bcrypt')

module.exports = (Schema) => {
  return (decoded, request, callback) => {
    Schema.models.User.findOne({
      where: { user_name: decoded.username },
      order: 'user_name' },
      (err, user) => {
        if (err)
          return callback(err)

        if (!user)
          return callback(null, false)

        Bcrypt.compare(decoded.password, user.user_secret, (error, isValid) => {
          callback(error, isValid, { id: user.id, name: user.user_name })
        })
      })
  }
}
