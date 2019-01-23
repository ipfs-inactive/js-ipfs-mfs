'use strict'

const waterfall = require('async/waterfall')
const UnixFS = require('ipfs-unixfs')
const {
  DAGNode
} = require('ipld-dag-pb')
const toMulticodecCode = require('./to-multicodec-code')

const createNode = (context, type, options, callback) => {
  waterfall([
    (done) => DAGNode.create(new UnixFS(type).marshal(), [], done),
    (node, done) => context.ipld.put(
      node,
      toMulticodecCode(options.format),
      {
        cidVersion: options.cidVersion,
        hashAlg: toMulticodecCode(options.hashAlg)
      }
    ).then(
      (cid) => done(null, { cid, node }),
      (error) => done(error)
    )
  ], callback)
}

module.exports = createNode
