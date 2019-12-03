/* eslint-env mocha */
'use strict'

const expect = require('../helpers/chai')
const cli = require('../helpers/cli')
const sinon = require('sinon')

describe('cli chmod', () => {
  let ipfs

  beforeEach(() => {
    ipfs = {
      files: {
        chmod: sinon.stub()
      }
    }
  })

  it('should update the mode for a file', async () => {
    await cli('files chmod 0777 /foo', { ipfs })

    expect(ipfs.files.chmod.callCount).to.equal(1)
    expect(ipfs.files.chmod.getCall(0).args).to.deep.equal([
      '/foo',
      parseInt('0777', 8), {
        recursive: false,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should update the mode recursively', async () => {
    await cli('files chmod 0777 --recursive /foo', { ipfs })

    expect(ipfs.files.chmod.callCount).to.equal(1)
    expect(ipfs.files.chmod.getCall(0).args).to.deep.equal([
      '/foo',
      parseInt('0777', 8), {
        recursive: true,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should update the mode recursively (short option)', async () => {
    await cli('files chmod 0777 -r /foo', { ipfs })

    expect(ipfs.files.chmod.callCount).to.equal(1)
    expect(ipfs.files.chmod.getCall(0).args).to.deep.equal([
      '/foo',
      parseInt('0777', 8), {
        recursive: true,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should update the mode without flushing', async () => {
    await cli('files chmod 0777 --flush false /foo', { ipfs })

    expect(ipfs.files.chmod.callCount).to.equal(1)
    expect(ipfs.files.chmod.getCall(0).args).to.deep.equal([
      '/foo',
      parseInt('0777', 8), {
        recursive: false,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: false,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should update the mode without flushing (short option)', async () => {
    await cli('files chmod 0777 -f false /foo', { ipfs })

    expect(ipfs.files.chmod.callCount).to.equal(1)
    expect(ipfs.files.chmod.getCall(0).args).to.deep.equal([
      '/foo',
      parseInt('0777', 8), {
        recursive: false,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: false,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should update the mode a different codec', async () => {
    await cli('files chmod 0777 --codec dag-foo /foo', { ipfs })

    expect(ipfs.files.chmod.callCount).to.equal(1)
    expect(ipfs.files.chmod.getCall(0).args).to.deep.equal([
      '/foo',
      parseInt('0777', 8), {
        recursive: false,
        format: 'dag-foo',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should update the mode a different codec (short option)', async () => {
    await cli('files chmod 0777 -c dag-foo /foo', { ipfs })

    expect(ipfs.files.chmod.callCount).to.equal(1)
    expect(ipfs.files.chmod.getCall(0).args).to.deep.equal([
      '/foo',
      parseInt('0777', 8), {
        recursive: false,
        format: 'dag-foo',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should update the mode a different hash algorithm', async () => {
    await cli('files chmod 0777 --hash-alg sha3-256 /foo', { ipfs })

    expect(ipfs.files.chmod.callCount).to.equal(1)
    expect(ipfs.files.chmod.getCall(0).args).to.deep.equal([
      '/foo',
      parseInt('0777', 8), {
        recursive: false,
        format: 'dag-pb',
        hashAlg: 'sha3-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should update the mode a different hash algorithm (short option)', async () => {
    await cli('files chmod 0777 -h sha3-256 /foo', { ipfs })

    expect(ipfs.files.chmod.callCount).to.equal(1)
    expect(ipfs.files.chmod.getCall(0).args).to.deep.equal([
      '/foo',
      parseInt('0777', 8), {
        recursive: false,
        format: 'dag-pb',
        hashAlg: 'sha3-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should update the mode with a shard split threshold', async () => {
    await cli('files chmod 0777 --shard-split-threshold 10 /foo', { ipfs })

    expect(ipfs.files.chmod.callCount).to.equal(1)
    expect(ipfs.files.chmod.getCall(0).args).to.deep.equal([
      '/foo',
      parseInt('0777', 8), {
        recursive: false,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 10
      }
    ])
  })
})
