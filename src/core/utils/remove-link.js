'use strict'

const {
  DAGNode,
  DAGLink
} = require('./dag-pb')
const CID = require('cids')
const log = require('debug')('ipfs:mfs:core:utils:remove-link')
const UnixFS = require('ipfs-unixfs')
const {
  generatePath,
  updateHamtDirectory
} = require('./hamt-utils')
const errCode = require('err-code')
const mc = require('multicodec')
const mh = require('multihashes')

const removeLink = async (context, options) => {
  if (!options.parentCid && !options.parent) {
    throw errCode(new Error('No parent node or CID passed to removeLink'), 'EINVALIDPARENT')
  }

  if (options.parentCid && !CID.isCID(options.parentCid)) {
    throw errCode(new Error('Invalid CID passed to removeLink'), 'EINVALIDPARENTCID')
  }

  if (!options.parent) {
    log('Loading parent node', options.parentCid.toBaseEncodedString())

    options.parent = await context.ipld.get(options.parentCid)
  }

  if (!options.name) {
    throw errCode(new Error('No child name passed to removeLink'), 'EINVALIDCHILDNAME')
  }

  const meta = UnixFS.unmarshal(options.parent.data)

  if (meta.type === 'hamt-sharded-directory') {
    log(`Removing ${options.name} from sharded directory`)

    return removeFromShardedDirectory(context, options)
  }

  log(`Removing link ${options.name} regular directory`)

  return removeFromDirectory(context, options)
}

const removeFromDirectory = async (context, options) => {
  const format = mc[options.format.toUpperCase().replace(/-/g, '_')]
  const hashAlg = mh.names[options.hashAlg]

  const newParentNode = await DAGNode.rmLink(options.parent, options.name)
  const cid = await context.ipld.put(newParentNode, format, {
    cidVersion: options.cidVersion,
    hashAlg
  })

  log('Updated regular directory', cid.toBaseEncodedString())

  return {
    node: newParentNode,
    cid
  }
}

const removeFromShardedDirectory = async (context, options) => {
  const {
    rootBucket, path
  } = await generatePath(context, options.name, options.parent)

  await rootBucket.del(options.name)

  const {
    node
  } = await updateShard(context, path, {
    name: options.name,
    cid: options.cid,
    size: options.size,
    hashAlg: options.hashAlg,
    format: options.format,
    cidVersion: options.cidVersion,
    flush: options.flush
  }, options)

  return updateHamtDirectory(context, node.links, rootBucket, options)
}

const updateShard = async (context, positions, child, options) => {
  const {
    bucket,
    prefix,
    node
  } = positions.pop()

  const link = node.links
    .find(link => link.name.substring(0, 2) === prefix)

  if (!link) {
    throw errCode(new Error(`No link found with prefix ${prefix} for file ${child.name}`), 'ERR_NOT_FOUND')
  }

  if (link.name === `${prefix}${child.name}`) {
    log(`Removing existing link ${link.name}`)

    const newNode = await DAGNode.rmLink(node, link.name)

    await bucket.del(child.name)

    return updateHamtDirectory(context, newNode.links, bucket, options)
  }

  log(`Descending into sub-shard ${link.name} for ${prefix}${child.name}`)

  const result = await updateShard(context, positions, child, options)

  let newName = prefix

  if (result.node.links.length === 1) {
    log(`Removing subshard for ${prefix}`)

    // convert shard back to normal dir
    result.cid = result.node.links[0].cid
    result.node = result.node.links[0]

    newName = `${prefix}${result.node.name.substring(2)}`
  }

  log(`Updating shard ${prefix} with name ${newName}`)

  return updateShardParent(context, bucket, node, prefix, newName, result.node.size, result.cid, options)
}

const updateShardParent = async (context, bucket, parent, oldName, newName, size, cid, options) => {
  parent = await DAGNode.rmLink(parent, oldName)
  parent = await DAGNode.addLink(parent, await DAGLink.create(newName, size, cid))

  return updateHamtDirectory(context, parent.links, bucket, options)
}

module.exports = removeLink
