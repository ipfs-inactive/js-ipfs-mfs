/* eslint-env mocha */
'use strict'

const expect = require('../helpers/chai')
const cli = require('../helpers/cli')
const sinon = require('sinon')

describe('cli touch', () => {
  let ipfs

  beforeEach(() => {
    ipfs = {
      files: {
        touch: sinon.stub()
      }
    }
  })

  it('should update the mtime for a file', async () => {
    const path = '/foo'
    const mtime = parseInt(Date.now() / 1000)

    await cli(`files touch -m ${mtime} ${path}`, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime, {
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should update the mode without flushing', async () => {
    const path = '/foo'
    const mtime = parseInt(Date.now() / 1000)

    await cli(`files touch -m ${mtime} --flush false ${path}`, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime, {
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: false,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should update the mode without flushing (short option)', async () => {
    const path = '/foo'
    const mtime = parseInt(Date.now() / 1000)

    await cli(`files touch -m ${mtime} -f false ${path}`, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime, {
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: false,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should update the mode a different codec', async () => {
    const path = '/foo'
    const mtime = parseInt(Date.now() / 1000)

    await cli(`files touch -m ${mtime} --codec dag-foo ${path}`, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime, {
        cidVersion: 0,
        format: 'dag-foo',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should update the mode a different codec (short option)', async () => {
    const path = '/foo'
    const mtime = parseInt(Date.now() / 1000)

    await cli(`files touch -m ${mtime} -c dag-foo ${path}`, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime, {
        cidVersion: 0,
        format: 'dag-foo',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should update the mode a different hash algorithm', async () => {
    const path = '/foo'
    const mtime = parseInt(Date.now() / 1000)

    await cli(`files touch -m ${mtime} --hash-alg sha3-256 ${path}`, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime, {
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha3-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should update the mode a different hash algorithm (short option)', async () => {
    const path = '/foo'
    const mtime = parseInt(Date.now() / 1000)

    await cli(`files touch -m ${mtime} -h sha3-256 ${path}`, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime, {
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha3-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should update the mode with a shard split threshold', async () => {
    const path = '/foo'
    const mtime = parseInt(Date.now() / 1000)

    await cli(`files touch -m ${mtime} --shard-split-threshold 10 ${path}`, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime, {
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 10
      }
    ])
  })
})
