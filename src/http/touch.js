'use strict'

const Joi = require('@hapi/joi')

const mfsTouch = {
  method: 'POST',
  path: '/api/v0/files/touch',
  async handler (request, h) {
    const {
      ipfs
    } = request.server.app
    const {
      arg,
      flush,
      shardSplitThreshold,
      cidVersion,
      mtime
    } = request.query

    await ipfs.files.touch(arg, mtime, {
      flush,
      shardSplitThreshold,
      cidVersion
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
        arg: Joi.array().items(Joi.string()).min(2),
        mtime: Joi.number().integer().min(0),
        flush: Joi.boolean().default(true),
        shardSplitThreshold: Joi.number().integer().min(0).default(1000),
        cidVersion: Joi.number().integer().valid([
          0,
          1
        ]).default(0)
      })
    }
  }
}

module.exports = mfsTouch
