'use strict'

const Bcrypt = require('bcrypt')

module.exports = (pw) => Bcrypt.hashSync(pw, 10)
