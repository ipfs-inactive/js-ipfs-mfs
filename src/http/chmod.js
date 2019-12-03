'use strict'

const originalJoi = require('@hapi/joi')
const Joi = originalJoi.extend({
  name: 'octalNumber',
  base: originalJoi.number().min(0),
  coerce: (value, state, options) => {
    const val = parseInt(value, 8)

    if (isNaN(val) || val < 0) {
      throw new Error('Invalid octal number')
    }

    return val
  }
})

const mfsChmod = {
  method: 'POST',
  path: '/api/v0/files/chmod',
  async handler (request, h) {
    const {
      ipfs
    } = request.server.app
    const {
      arg,
      flush,
      mode
    } = request.query

    await ipfs.files.chmod(arg, mode, {
      flush
    })

    return h.response()
  },
  options: {
    validate: {
      options: {
        allowUnknown: true,
        stripUnknown: true
      },
      query: Joi.object().keys({
        arg: Joi.string(),
        mode: Joi.octalNumber(),
        flush: Joi.boolean().default(true)
      })
    }
  }
}

module.exports = mfsChmod
