/* eslint-env mocha */
'use strict'

const expect = require('../helpers/chai')
const cli = require('../helpers/cli')
const sinon = require('sinon')

describe('cli mv', () => {
  let ipfs

  beforeEach(() => {
    ipfs = {
      files: {
        mv: sinon.stub()
      }
    }
  })

  it('should move an entry', async () => {
    const source = '/src'
    const dest = '/dest'

    await cli(`files mv ${source} ${dest}`, { ipfs })

    expect(ipfs.files.mv.callCount).to.equal(1)
    expect(ipfs.files.mv.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        recursive: false,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should move an entry and create parents', async () => {
    const source = '/src'
    const dest = '/dest'

    await cli(`files mv --parents ${source} ${dest}`, { ipfs })

    expect(ipfs.files.mv.callCount).to.equal(1)
    expect(ipfs.files.mv.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: true,
        recursive: false,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should move an entry and create parents (short option)', async () => {
    const source = '/src'
    const dest = '/dest'

    await cli(`files mv -p ${source} ${dest}`, { ipfs })

    expect(ipfs.files.mv.callCount).to.equal(1)
    expect(ipfs.files.mv.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: true,
        recursive: false,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should move an entry recursively', async () => {
    const source = '/src'
    const dest = '/dest'

    await cli(`files mv --recursive ${source} ${dest}`, { ipfs })

    expect(ipfs.files.mv.callCount).to.equal(1)
    expect(ipfs.files.mv.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        recursive: true,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should move an entry recursively (short option)', async () => {
    const source = '/src'
    const dest = '/dest'

    await cli(`files mv -r ${source} ${dest}`, { ipfs })

    expect(ipfs.files.mv.callCount).to.equal(1)
    expect(ipfs.files.mv.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        recursive: true,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should make a directory with a different cid version', async () => {
    const source = '/src'
    const dest = '/dest'

    await cli(`files mv --cid-version 5 ${source} ${dest}`, { ipfs })

    expect(ipfs.files.mv.callCount).to.equal(1)
    expect(ipfs.files.mv.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        recursive: false,
        cidVersion: 5,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should make a directory with a different cid version (shortish option)', async () => {
    const source = '/src'
    const dest = '/dest'

    await cli(`files mv --cid-ver 5 ${source} ${dest}`, { ipfs })

    expect(ipfs.files.mv.callCount).to.equal(1)
    expect(ipfs.files.mv.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        recursive: false,
        cidVersion: 5,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should make a directory with a different codec', async () => {
    const source = '/src'
    const dest = '/dest'

    await cli(`files mv --codec dag-foo ${source} ${dest}`, { ipfs })

    expect(ipfs.files.mv.callCount).to.equal(1)
    expect(ipfs.files.mv.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        recursive: false,
        cidVersion: 0,
        format: 'dag-foo',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should make a directory with a different codec (short option)', async () => {
    const source = '/src'
    const dest = '/dest'

    await cli(`files mv -c dag-foo ${source} ${dest}`, { ipfs })

    expect(ipfs.files.mv.callCount).to.equal(1)
    expect(ipfs.files.mv.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        recursive: false,
        cidVersion: 0,
        format: 'dag-foo',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should make a directory with a different hash algorithm', async () => {
    const source = '/src'
    const dest = '/dest'

    await cli(`files mv --hash-alg sha3-256 ${source} ${dest}`, { ipfs })

    expect(ipfs.files.mv.callCount).to.equal(1)
    expect(ipfs.files.mv.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        recursive: false,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha3-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should make a directory with a different hash algorithm (short option)', async () => {
    const source = '/src'
    const dest = '/dest'

    await cli(`files mv -h sha3-256 ${source} ${dest}`, { ipfs })

    expect(ipfs.files.mv.callCount).to.equal(1)
    expect(ipfs.files.mv.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        recursive: false,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha3-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should make a directory without flushing', async () => {
    const source = '/src'
    const dest = '/dest'

    await cli(`files mv --flush false ${source} ${dest}`, { ipfs })

    expect(ipfs.files.mv.callCount).to.equal(1)
    expect(ipfs.files.mv.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        recursive: false,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: false,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should make a directory without flushing (short option)', async () => {
    const source = '/src'
    const dest = '/dest'

    await cli(`files mv -f false ${source} ${dest}`, { ipfs })

    expect(ipfs.files.mv.callCount).to.equal(1)
    expect(ipfs.files.mv.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        recursive: false,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: false,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should make a directory a different shard split threshold', async () => {
    const source = '/src'
    const dest = '/dest'

    await cli(`files mv --shard-split-threshold 10 ${source} ${dest}`, { ipfs })

    expect(ipfs.files.mv.callCount).to.equal(1)
    expect(ipfs.files.mv.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        recursive: false,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 10
      }
    ])
  })
})
