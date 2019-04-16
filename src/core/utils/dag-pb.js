'use strict'

const {
  DAGNode,
  DAGLink
} = require('ipld-dag-pb')
const promisify = require('promisify-es6')

const node = {
  create: promisify(DAGNode.create, {
    context: DAGNode
  }),
  addLink: promisify(DAGNode.addLink, {
    context: DAGNode
  }),
  rmLink: promisify(DAGNode.rmLink, {
    context: DAGNode
  })
}

const link = {
  create: promisify(DAGLink.create, {
    context: DAGLink
  })
}

module.exports = {
  DAGNode: node,
  DAGLink: link
}
