'use strict'

const originalJoi = require('@hapi/joi')
const Joi = originalJoi.extend({
  name: 'octalNumber',
  base: originalJoi.number().min(0),
  coerce: (value, state, options) => {
    if (value === undefined) {
      return
    }

    const val = parseInt(value, 8)

    if (isNaN(val) || val < 0) {
      throw new Error('Invalid octal number')
    }

    return val
  }
})

module.exports = Joi
