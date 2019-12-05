/* eslint-env mocha */
'use strict'

const expect = require('../helpers/chai')
const cli = require('../helpers/cli')
const sinon = require('sinon')
const isNode = require('detect-node')

function defaultOptions (modification = {}) {
  const options = {
    cidVersion: 0,
    format: 'dag-pb',
    hashAlg: 'sha2-256',
    flush: true,
    shardSplitThreshold: 1000
  }

  Object.keys(modification).forEach(key => {
    options[key] = modification[key]
  })

  return options
}

describe('touch', () => {
  if (!isNode) {
    return
  }

  const path = '/foo'
  const mtime = parseInt(Date.now() / 1000)
  let ipfs

  beforeEach(() => {
    ipfs = {
      files: {
        touch: sinon.stub()
      }
    }
  })

  it('should update the mtime for a file', async () => {
    await cli(`files touch -m ${mtime} ${path}`, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime,
      defaultOptions()
    ])
  })

  it('should update the mtime without flushing', async () => {
    await cli(`files touch -m ${mtime} --flush false ${path}`, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime,
      defaultOptions({
        flush: false
      })
    ])
  })

  it('should update the mtime without flushing (short option)', async () => {
    await cli(`files touch -m ${mtime} -f false ${path}`, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime,
      defaultOptions({
        flush: false
      })
    ])
  })

  it('should update the mtime with a different codec', async () => {
    await cli(`files touch -m ${mtime} --codec dag-foo ${path}`, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime,
      defaultOptions({
        format: 'dag-foo'
      })
    ])
  })

  it('should update the mtime with a different codec (short option)', async () => {
    await cli(`files touch -m ${mtime} -c dag-foo ${path}`, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime,
      defaultOptions({
        format: 'dag-foo'
      })
    ])
  })

  it('should update the mtime with a different hash algorithm', async () => {
    await cli(`files touch -m ${mtime} --hash-alg sha3-256 ${path}`, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime,
      defaultOptions({
        hashAlg: 'sha3-256'
      })
    ])
  })

  it('should update the mtime with a different hash algorithm (short option)', async () => {
    await cli(`files touch -m ${mtime} -h sha3-256 ${path}`, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime,
      defaultOptions({
        hashAlg: 'sha3-256'
      })
    ])
  })

  it('should update the mtime with a shard split threshold', async () => {
    await cli(`files touch -m ${mtime} --shard-split-threshold 10 ${path}`, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime,
      defaultOptions({
        shardSplitThreshold: 10
      })
    ])
  })
})
