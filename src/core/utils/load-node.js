'use strict'

const CID = require('cids')
const log = require('debug')('ipfs:mfs:utils:load-node')

const loadNode = (context, dagLink, callback) => {
  const cid = new CID(dagLink.cid)

  log(`Loading DAGNode for child ${cid.toBaseEncodedString()}`)

  context.ipld.get(cid).then(
    (node) => callback(null, { cid, node }),
    (error) => callback(error)
  )
}

module.exports = loadNode
