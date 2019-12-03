/* eslint-env mocha */
'use strict'

const expect = require('../helpers/chai')
const cli = require('../helpers/cli')
const sinon = require('sinon')

describe('cli mkdir', () => {
  let ipfs

  beforeEach(() => {
    ipfs = {
      files: {
        mkdir: sinon.stub()
      }
    }
  })

  it('should make a directory', async () => {
    await cli('files mkdir /foo', { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      '/foo', {
        parents: false,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000,
        mode: undefined,
        mtime: undefined
      }
    ])
  })

  it('should make a directory with parents', async () => {
    await cli('files mkdir --parents /foo', { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      '/foo', {
        parents: true,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000,
        mode: undefined,
        mtime: undefined
      }
    ])
  })

  it('should make a directory with parents (short option)', async () => {
    await cli('files mkdir -p /foo', { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      '/foo', {
        parents: true,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000,
        mode: undefined,
        mtime: undefined
      }
    ])
  })

  it('should make a directory with a different cid version', async () => {
    await cli('files mkdir --cid-version 5 /foo', { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      '/foo', {
        parents: false,
        cidVersion: 5,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000,
        mode: undefined,
        mtime: undefined
      }
    ])
  })

  it('should make a directory with a different cid version (shortish option)', async () => {
    await cli('files mkdir --cid-ver 5 /foo', { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      '/foo', {
        parents: false,
        cidVersion: 5,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000,
        mode: undefined,
        mtime: undefined
      }
    ])
  })

  it('should make a directory with a different codec', async () => {
    await cli('files mkdir --codec dag-foo /foo', { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      '/foo', {
        parents: false,
        cidVersion: 0,
        format: 'dag-foo',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000,
        mode: undefined,
        mtime: undefined
      }
    ])
  })

  it('should make a directory with a different codec (short option)', async () => {
    await cli('files mkdir -c dag-foo /foo', { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      '/foo', {
        parents: false,
        cidVersion: 0,
        format: 'dag-foo',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000,
        mode: undefined,
        mtime: undefined
      }
    ])
  })

  it('should make a directory with a different hash algorithm', async () => {
    await cli('files mkdir --hash-alg sha3-256 /foo', { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      '/foo', {
        parents: false,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha3-256',
        flush: true,
        shardSplitThreshold: 1000,
        mode: undefined,
        mtime: undefined
      }
    ])
  })

  it('should make a directory with a different hash algorithm (short option)', async () => {
    await cli('files mkdir -h sha3-256 /foo', { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      '/foo', {
        parents: false,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha3-256',
        flush: true,
        shardSplitThreshold: 1000,
        mode: undefined,
        mtime: undefined
      }
    ])
  })

  it('should make a directory without flushing', async () => {
    await cli('files mkdir --flush false /foo', { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      '/foo', {
        parents: false,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: false,
        shardSplitThreshold: 1000,
        mode: undefined,
        mtime: undefined
      }
    ])
  })

  it('should make a directory without flushing (short option)', async () => {
    await cli('files mkdir -f false /foo', { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      '/foo', {
        parents: false,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: false,
        shardSplitThreshold: 1000,
        mode: undefined,
        mtime: undefined
      }
    ])
  })

  it('should make a directory a different shard split threshold', async () => {
    await cli('files mkdir --shard-split-threshold 10 /foo', { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      '/foo', {
        parents: false,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 10,
        mode: undefined,
        mtime: undefined
      }
    ])
  })

  it('should make a directory a different mode', async () => {
    await cli('files mkdir --mode 0111 /foo', { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      '/foo', {
        parents: false,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000,
        mode: parseInt('0111', 8),
        mtime: undefined
      }
    ])
  })

  it('should make a directory a different mtime', async () => {
    await cli('files mkdir --mtime 5 /foo', { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      '/foo', {
        parents: false,
        cidVersion: 0,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000,
        mode: undefined,
        mtime: 5
      }
    ])
  })
})
