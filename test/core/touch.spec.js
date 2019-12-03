/* eslint-env mocha */
'use strict'

const expect = require('../helpers/chai')
const createMfs = require('../helpers/create-mfs')
const streamToBuffer = require('../helpers/stream-to-buffer')
const delay = require('delay')

describe('touch', () => {
  let mfs

  before(async () => {
    mfs = await createMfs()
  })

  it('should update the mtime for a file', async () => {
    const path = `/foo-${Date.now()}`

    await mfs.write(path, Buffer.from('Hello world'), {
      create: true,
      mtime: parseInt(new Date() / 1000)
    })
    const originalMtime = (await mfs.stat(path)).mtime
    await delay(1000)
    await mfs.touch(path, {
      flush: true
    })

    const updatedMtime = (await mfs.stat(path)).mtime
    expect(updatedMtime).to.be.greaterThan(originalMtime)
  })

  it('should update the mtime for a directory', async () => {
    const path = `/foo-${Date.now()}`

    await mfs.mkdir(path, {
      mtime: parseInt(Date.now() / 1000)
    })
    const originalMtime = (await mfs.stat(path)).mtime
    await delay(1000)
    await mfs.touch(path, {
      flush: true
    })

    const updatedMtime = (await mfs.stat(path)).mtime
    expect(updatedMtime).to.be.greaterThan(originalMtime)
  })

  it('should update the mtime for a hamt-sharded-directory', async () => {
    const path = `/foo-${Date.now()}`

    await mfs.mkdir(path, {
      mtime: parseInt(Date.now() / 1000)
    })
    await mfs.write(`${path}/foo.txt`, Buffer.from('Hello world'), {
      create: true,
      shardSplitThreshold: 0
    })
    const originalMtime = (await mfs.stat(path)).mtime
    await delay(1000)
    await mfs.touch(path, {
      flush: true
    })

    const updatedMtime = (await mfs.stat(path)).mtime
    expect(updatedMtime).to.be.greaterThan(originalMtime)
  })

  it('should create an empty file', async () => {
    const path = `/foo-${Date.now()}`

    await mfs.touch(path, {
      flush: true
    })

    const buffer = await streamToBuffer(mfs.read(path))

    expect(buffer).to.deep.equal(Buffer.from([]))
  })
})
