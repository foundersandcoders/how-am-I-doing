'use strict'
const Bcrypt = require('bcrypt')

module.exports = (server) => {
  return (decoded, request, callback) => {
    server.app.User.findOne({
      where: { user_name: decoded.username },
      order: 'user_name' },
      (err, user) => {
        if (!user) return callback(null, false)

        if (err) return callback(err)

        Bcrypt.compare(decoded.password, user.user_secret, (error, isValid) => {
          callback(error, isValid, { id: user.user_id, name: user.user_name })
        })
      })
  }
}
