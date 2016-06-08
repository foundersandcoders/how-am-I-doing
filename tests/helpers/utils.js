'use strict'

exports.randstr = (len) => {
  return (Date.now() * Math.random()).toString(36).replace('.', '').slice(0, len)
}

exports.randnum = (min, max) => (max - min) * Math.random() + min
