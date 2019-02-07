'use strict'

const Joi = require('joi')
const multipart = require('ipfs-multipart')

const mfsWrite = {
  method: 'POST',
  path: '/api/v0/files/write',
  async handler (request, h) {
    const {
      ipfs
    } = request.server.app
    const {
      arg,
      offset,
      length,
      create,
      truncate,
      rawLeaves,
      cidVersion,
      hashAlg,
      format,
      parents,
      progress,
      strategy,
      flush,
      shardSplitThreshold
    } = request.query

    const fileStream = await new Promise((resolve, reject) => {
      const parser = multipart.reqParser(request.payload)

      parser.on('file', (_, stream) => {
        resolve(stream)
      })

      parser.on('error', (error) => {
        reject(error)
      })
    })

    await ipfs.files.write(arg, fileStream, {
      offset,
      length,
      create,
      truncate,
      rawLeaves,
      cidVersion,
      hashAlg,
      format,
      parents,
      progress,
      strategy,
      flush,
      shardSplitThreshold
    })

    return h.response()
  },
  options: {
    payload: {
      parse: false,
      output: 'stream'
    },
    validate: {
      options: {
        allowUnknown: true,
        stripUnknown: true
      },
      query: Joi.object().keys({
        arg: Joi.string().required(),
        offset: Joi.number().integer().min(0),
        length: Joi.number().integer().min(0),
        create: Joi.boolean().default(false),
        truncate: Joi.boolean().default(false),
        rawLeaves: Joi.boolean().default(false),
        cidVersion: Joi.number().integer().valid([
          0,
          1
        ]).default(1),
        hashAlg: Joi.string().valid([
          'sha2-256'
        ]).default('sha2-256'),
        format: Joi.string().valid([
          'dag-pb',
          'dag-cbor'
        ]).default('dag-pb'),
        parents: Joi.boolean().default(false),
        progress: Joi.func(),
        strategy: Joi.string().valid([
          'flat',
          'balanced',
          'trickle'
        ]).default('trickle'),
        flush: Joi.boolean().default(true)
      })
        .rename('o', 'offset', {
          override: true,
          ignoreUndefined: true
        })
        .rename('e', 'create', {
          override: true,
          ignoreUndefined: true
        })
        .rename('t', 'truncate', {
          override: true,
          ignoreUndefined: true
        })
    }
  }
}

module.exports = mfsWrite
