/* eslint-env mocha */
'use strict'

const expect = require('../helpers/chai')
const cli = require('../helpers/cli')
const sinon = require('sinon')

function defaultOptions (modification = {}) {
  const options = {
    offset: undefined,
    length: undefined,
    create: false,
    truncate: false,
    rawLeaves: false,
    reduceSingleLeafToSelf: false,
    cidVersion: 0,
    hashAlg: 'sha2-256',
    format: 'dag-pb',
    parents: false,
    progress: undefined,
    strategy: 'balanced',
    flush: true,
    shardSplitThreshold: 1000,
    mode: undefined,
    mtime: undefined
  }

  Object.keys(modification).forEach(key => {
    options[key] = modification[key]
  })

  return options
}

describe('cli write', () => {
  const stdin = 'stdin'
  const getStdin = () => stdin
  let ipfs

  beforeEach(() => {
    ipfs = {
      files: {
        write: sinon.stub()
      }
    }
  })

  it('should write to a file', async () => {
    const path = '/foo'

    await cli(`files write ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions()
    ])
  })

  it('should write to a file and create parents', async () => {
    const path = '/foo'

    await cli(`files write --parents ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        parents: true
      })
    ])
  })

  it('should write to a file and create parents (short option)', async () => {
    const path = '/foo'

    await cli(`files write -p ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        parents: true
      })
    ])
  })

  it('should write to a file and create it', async () => {
    const path = '/foo'

    await cli(`files write --create ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        create: true
      })
    ])
  })

  it('should write to a file and create it (short option)', async () => {
    const path = '/foo'

    await cli(`files write -e ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        create: true
      })
    ])
  })

  it('should write to a file with an offset', async () => {
    const path = '/foo'

    await cli(`files write --offset 10 ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        offset: 10
      })
    ])
  })

  it('should write to a file with an offset (short option)', async () => {
    const path = '/foo'

    await cli(`files write -o 10 ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        offset: 10
      })
    ])
  })

  it('should write to a file with an length', async () => {
    const path = '/foo'

    await cli(`files write --length 10 ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        length: 10
      })
    ])
  })

  it('should write to a file with a length (short option)', async () => {
    const path = '/foo'

    await cli(`files write -l 10 ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        length: 10
      })
    ])
  })

  it('should write to a file and truncate it', async () => {
    const path = '/foo'

    await cli(`files write --truncate ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        truncate: true
      })
    ])
  })

  it('should write to a file and truncate it (short option)', async () => {
    const path = '/foo'

    await cli(`files write -t ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        truncate: true
      })
    ])
  })

  it('should write to a file with raw leaves', async () => {
    const path = '/foo'

    await cli(`files write --raw-leaves ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        rawLeaves: true
      })
    ])
  })

  it('should write to a file with raw leaves (short option)', async () => {
    const path = '/foo'

    await cli(`files write -r ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        rawLeaves: true
      })
    ])
  })

  it('should write to a file and reduce a single leaf to one node', async () => {
    const path = '/foo'

    await cli(`files write --reduce-single-leaf-to-self ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        reduceSingleLeafToSelf: true
      })
    ])
  })

  it('should write to a file without flushing', async () => {
    const path = '/foo'

    await cli(`files write --flush false ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        flush: false
      })
    ])
  })

  it('should write to a file without flushing (short option)', async () => {
    const path = '/foo'

    await cli(`files write -f false ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        flush: false
      })
    ])
  })

  it('should write to a file with a different strategy', async () => {
    const path = '/foo'

    await cli(`files write --strategy trickle ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        strategy: 'trickle'
      })
    ])
  })

  it('should write to a file with a different strategy (short option)', async () => {
    const path = '/foo'

    await cli(`files write -s trickle ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        strategy: 'trickle'
      })
    ])
  })

  it('should write to a file with a different cid version', async () => {
    const path = '/foo'

    await cli(`files write --cid-version 5 ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        cidVersion: 5
      })
    ])
  })

  it('should write to a file with a different cid version (shortish option)', async () => {
    const path = '/foo'

    await cli(`files write --cid-ver 5 ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        cidVersion: 5
      })
    ])
  })

  it('should update the mode a different codec', async () => {
    const path = '/foo'

    await cli(`files write --codec dag-foo ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        format: 'dag-foo'
      })
    ])
  })

  it('should update the mode a different codec (short option)', async () => {
    const path = '/foo'

    await cli(`files write -c dag-foo ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        format: 'dag-foo'
      })
    ])
  })

  it('should update the mode a different hash algorithm', async () => {
    const path = '/foo'

    await cli(`files write --hash-alg sha3-256 ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        hashAlg: 'sha3-256'
      })
    ])
  })

  it('should update the mode a different hash algorithm (short option)', async () => {
    const path = '/foo'

    await cli(`files write -h sha3-256 ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        hashAlg: 'sha3-256'
      })
    ])
  })

  it('should update the mode with a shard split threshold', async () => {
    const path = '/foo'

    await cli(`files write --shard-split-threshold 10 ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        shardSplitThreshold: 10
      })
    ])
  })

  it('should update the mode a different mode', async () => {
    const path = '/foo'

    await cli(`files write --mode 0557 ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        mode: parseInt('0557', 8)
      })
    ])
  })

  it('should update the mode a different mtime', async () => {
    const path = '/foo'

    await cli(`files write --mtime 11 ${path}`, { ipfs, getStdin })

    expect(ipfs.files.write.callCount).to.equal(1)
    expect(ipfs.files.write.getCall(0).args).to.deep.equal([
      path,
      stdin,
      defaultOptions({
        mtime: 11
      })
    ])
  })
})
