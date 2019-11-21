'use strict'

const Joi = require('@hapi/joi')

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
        mode: Joi.number().integer().min(0),
        flush: Joi.boolean().default(true)
      })
    }
  }
}

module.exports = mfsChmod
