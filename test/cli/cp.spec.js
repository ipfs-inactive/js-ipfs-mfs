/* eslint-env mocha */
'use strict'

const expect = require('../helpers/chai')
const cli = require('../helpers/cli')
const sinon = require('sinon')

describe('cli cp', () => {
  let ipfs

  beforeEach(() => {
    ipfs = {
      files: {
        cp: sinon.stub()
      }
    }
  })

  it('should copy files', async () => {
    const source = 'source'
    const dest = 'source'

    await cli(`files cp ${source} ${dest}`, { ipfs })

    expect(ipfs.files.cp.callCount).to.equal(1)
    expect(ipfs.files.cp.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should copy files and create intermediate directrories', async () => {
    const source = 'source'
    const dest = 'source'

    await cli(`files cp --parents ${source} ${dest}`, { ipfs })

    expect(ipfs.files.cp.callCount).to.equal(1)
    expect(ipfs.files.cp.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: true,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should copy files and create intermediate directrories (short option)', async () => {
    const source = 'source'
    const dest = 'source'

    await cli(`files cp --parents ${source} ${dest}`, { ipfs })

    expect(ipfs.files.cp.callCount).to.equal(1)
    expect(ipfs.files.cp.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: true,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should copy files with a different codec', async () => {
    const source = 'source'
    const dest = 'source'

    await cli(`files cp --codec dag-foo ${source} ${dest}`, { ipfs })

    expect(ipfs.files.cp.callCount).to.equal(1)
    expect(ipfs.files.cp.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        format: 'dag-foo',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should copy files with a different codec (short option)', async () => {
    const source = 'source'
    const dest = 'source'

    await cli(`files cp -c dag-foo ${source} ${dest}`, { ipfs })

    expect(ipfs.files.cp.callCount).to.equal(1)
    expect(ipfs.files.cp.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        format: 'dag-foo',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should copy files with a different hash algorithm', async () => {
    const source = 'source'
    const dest = 'source'

    await cli(`files cp --hash-alg sha3-256 ${source} ${dest}`, { ipfs })

    expect(ipfs.files.cp.callCount).to.equal(1)
    expect(ipfs.files.cp.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        format: 'dag-pb',
        hashAlg: 'sha3-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should copy files with a different hash algorithm (short option)', async () => {
    const source = 'source'
    const dest = 'source'

    await cli(`files cp -h sha3-256 ${source} ${dest}`, { ipfs })

    expect(ipfs.files.cp.callCount).to.equal(1)
    expect(ipfs.files.cp.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        format: 'dag-pb',
        hashAlg: 'sha3-256',
        flush: true,
        shardSplitThreshold: 1000
      }
    ])
  })

  it('should copy files with a different shard split threshold', async () => {
    const source = 'source'
    const dest = 'source'

    await cli(`files cp --shard-split-threshold 10 ${source} ${dest}`, { ipfs })

    expect(ipfs.files.cp.callCount).to.equal(1)
    expect(ipfs.files.cp.getCall(0).args).to.deep.equal([
      source,
      dest, {
        parents: false,
        format: 'dag-pb',
        hashAlg: 'sha2-256',
        flush: true,
        shardSplitThreshold: 10
      }
    ])
  })
})
