/* eslint-env mocha */
'use strict'

const expect = require('../helpers/chai')
const createMfs = require('../helpers/create-mfs')

describe('chmod', () => {
  let mfs

  before(async () => {
    mfs = await createMfs()
  })

  it('should update the mode for a file', async () => {
    const path = `/foo-${Date.now()}`

    await mfs.write(path, Buffer.from('Hello world'), {
      create: true,
      mtime: parseInt(new Date() / 1000)
    })
    const targetMode = parseInt('0777', 8)
    const originalMode = (await mfs.stat(path)).mode
    await mfs.chmod(path, targetMode, {
      flush: true
    })

    const updatedMode = (await mfs.stat(path)).mode
    expect(updatedMode).to.not.equal(originalMode)
    expect(updatedMode).to.equal(targetMode)
  })

  it('should update the mode for a directory', async () => {
    const path = `/foo-${Date.now()}`

    await mfs.mkdir(path)
    const targetMode = parseInt('0777', 8)
    const originalMode = (await mfs.stat(path)).mode
    await mfs.chmod(path, targetMode, {
      flush: true
    })

    const updatedMode = (await mfs.stat(path)).mode
    expect(updatedMode).to.not.equal(originalMode)
    expect(updatedMode).to.equal(targetMode)
  })

  it('should update the mode for a hamt-sharded-directory', async () => {
    const path = `/foo-${Date.now()}`

    await mfs.mkdir(path)
    await mfs.write(`${path}/foo.txt`, Buffer.from('Hello world'), {
      create: true,
      shardSplitThreshold: 0
    })
    const targetMode = parseInt('0777', 8)
    const originalMode = (await mfs.stat(path)).mode
    await mfs.chmod(path, targetMode, {
      flush: true
    })

    const updatedMode = (await mfs.stat(path)).mode
    expect(updatedMode).to.not.equal(originalMode)
    expect(updatedMode).to.equal(targetMode)
  })
})
