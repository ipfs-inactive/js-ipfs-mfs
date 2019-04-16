'use strict'

const {
  DAGNode,
  DAGLink
} = require('./dag-pb')
const CID = require('cids')
const log = require('debug')('ipfs:mfs:core:utils:add-link')
const UnixFS = require('ipfs-unixfs')
const DirSharded = require('ipfs-unixfs-importer/src/importer/dir-sharded')
const {
  updateHamtDirectory,
  recreateHamtLevel,
  createShard,
  toPrefix,
  addLinksToHamtBucket
} = require('./hamt-utils')
const errCode = require('err-code')
const promisify = require('promisify-es6')
const mc = require('multicodec')
const mh = require('multihashes')

const addLink = async (context, options) => {
  if (!options.parentCid && !options.parent) {
    throw errCode(new Error('No parent node or CID passed to addLink'), 'EINVALIDPARENT')
  }

  if (options.parentCid && !CID.isCID(options.parentCid)) {
    throw errCode(new Error('Invalid CID passed to addLink'), 'EINVALIDPARENTCID')
  }

  if (!options.parent) {
    log('Loading parent node', options.parentCid.toBaseEncodedString())

    options.parent = await context.ipld.get(options.parentCid)
  }

  if (!options.cid) {
    throw errCode(new Error('No child cid passed to addLink'), 'EINVALIDCHILDCID')
  }

  if (!options.name) {
    throw errCode(new Error('No child name passed to addLink'), 'EINVALIDCHILDNAME')
  }

  if (!CID.isCID(options.cid)) {
    options.cid = new CID(options.cid)
  }

  if (!options.size && options.size !== 0) {
    throw errCode(new Error('No child size passed to addLink'), 'EINVALIDCHILDSIZE')
  }

  const meta = UnixFS.unmarshal(options.parent.data)

  if (meta.type === 'hamt-sharded-directory') {
    log('Adding link to sharded directory')

    return addToShardedDirectory(context, options)
  }

  if (options.parent.links.length >= options.shardSplitThreshold) {
    log('Converting directory to sharded directory')

    return convertToShardedDirectory(context, options)
  }

  log(`Adding ${options.name} (${options.cid.toBaseEncodedString()}) to regular directory`)

  return addToDirectory(context, options)
}

const convertToShardedDirectory = async (context, options) => {
  const result = await createShard(context, options.parent.links.map(link => ({
    name: link.name,
    size: link.size,
    cid: link.cid
  })).concat({
    name: options.name,
    size: options.size,
    cid: options.cid
  }))

  log('Converted directory to sharded directory', result.cid.toBaseEncodedString())

  return result
}

const addToDirectory = async (context, options) => {
  let parent = await DAGNode.rmLink(options.parent, options.name)
  parent = await DAGNode.addLink(parent, await DAGLink.create(options.name, options.size, options.cid))

  const format = mc[options.format.toUpperCase().replace(/-/g, '_')]
  const hashAlg = mh.names[options.hashAlg]

  // Persist the new parent DAGNode
  const cid = await context.ipld.put(parent, format, {
    cidVersion: options.cidVersion,
    hashAlg,
    hashOnly: !options.flush
  })

  return {
    node: parent,
    cid
  }
}

const addToShardedDirectory = async (context, options) => {
  const {
    shard, path
  } = await addFileToShardedDirectory(context, options)

  const result = await shard.flush('', context.ipld, null)

  // we have written out the shard, but only one sub-shard will have been written so replace it in the original shard
  const oldLink = options.parent.links
    .find(link => link.name.substring(0, 2) === path[0].prefix)

  const newLink = result.node.links
    .find(link => link.name.substring(0, 2) === path[0].prefix)

  let parent = options.parent

  if (oldLink) {
    parent = await DAGNode.rmLink(options.parent, oldLink.name)
  }

  parent = await DAGNode.addLink(parent, newLink)

  return updateHamtDirectory(context, parent.links, path[0].bucket, options)
}

const addFileToShardedDirectory = async (context, options) => {
  const file = {
    name: options.name,
    cid: options.cid,
    size: options.size
  }

  // start at the root bucket and descend, loading nodes as we go
  const rootBucket = await recreateHamtLevel(options.parent.links)

  const shard = new DirSharded({
    root: true,
    dir: true,
    parent: null,
    parentKey: null,
    path: '',
    dirty: true,
    flat: false
  })
  shard._bucket = rootBucket

  shard.flush = promisify(shard.flush, {
    context: shard
  })

  // load subshards until the bucket & position no longer changes
  const position = await rootBucket._findNewBucketAndPos(file.name)
  const path = toBucketPath(position)
  path[0].node = options.parent
  let index = 0

  while (index < path.length) {
    let segment = path[index]
    index++
    let node = segment.node

    let link = node.links
      .find(link => link.name.substring(0, 2) === segment.prefix)

    if (!link) {
      // prefix is new, file will be added to the current bucket
      log(`Link ${segment.prefix}${file.name} will be added`)
      index = path.length

      break
    }

    if (link.name === `${segment.prefix}${file.name}`) {
      // file already existed, file will be added to the current bucket
      log(`Link ${segment.prefix}${file.name} will be replaced`)
      index = path.length

      break
    }

    if (link.name.length > 2) {
      // another file had the same prefix, will be replaced with a subshard
      log(`Link ${link.name} will be replaced with a subshard`)
      index = path.length

      break
    }

    // load sub-shard
    log(`Found subshard ${segment.prefix}`)
    const subShard = await context.ipld.get(link.cid)

    // subshard hasn't been loaded, descend to the next level of the HAMT
    if (!path[index]) {
      log(`Loaded new subshard ${segment.prefix}`)
      await recreateHamtLevel(subShard.links, rootBucket, segment.bucket, parseInt(segment.prefix, 16))

      const position = await rootBucket._findNewBucketAndPos(file.name)

      path.push({
        bucket: position.bucket,
        prefix: toPrefix(position.pos),
        node: subShard
      })

      break
    }

    const nextSegment = path[index]

    // add next level's worth of links to bucket
    await addLinksToHamtBucket(subShard.links, nextSegment.bucket, rootBucket)

    nextSegment.node = subShard
  }

  // finally add the new file into the shard
  await shard._bucket.put(file.name, {
    size: file.size,
    cid: file.cid
  })

  return {
    shard, path
  }
}

const toBucketPath = (position) => {
  let bucket = position.bucket
  let positionInBucket = position.pos
  let path = [{
    bucket,
    prefix: toPrefix(positionInBucket)
  }]

  bucket = position.bucket._parent
  positionInBucket = position.bucket._posAtParent

  while (bucket) {
    path.push({
      bucket,
      prefix: toPrefix(positionInBucket)
    })

    positionInBucket = bucket._posAtParent
    bucket = bucket._parent
  }

  path.reverse()

  return path
}

module.exports = addLink
