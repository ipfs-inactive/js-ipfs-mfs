/* eslint-env mocha */
'use strict'

const expect = require('../helpers/chai')
const http = require('../helpers/http')
const sinon = require('sinon')

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
    await http({
      method: 'POST',
      url: `/api/v0/files/touch?arg=${path}&mtime=${mtime}`
    }, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime,
      defaultOptions()
    ])
  })

  it('should update the mtime without flushing', async () => {
    await http({
      method: 'POST',
      url: `/api/v0/files/touch?arg=${path}&mtime=${mtime}&flush=false`
    }, { ipfs })

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
    await http({
      method: 'POST',
      url: `/api/v0/files/touch?arg=${path}&mtime=${mtime}&format=dag-pb`
    }, { ipfs })

    expect(ipfs.files.touch.callCount).to.equal(1)
    expect(ipfs.files.touch.getCall(0).args).to.deep.equal([
      path,
      mtime,
      defaultOptions({
        format: 'dag-pb'
      })
    ])
  })

  it('should update the mtime with a different hash algorithm', async () => {
    await http({
      method: 'POST',
      url: `/api/v0/files/touch?arg=${path}&mtime=${mtime}&hashAlg=sha3-256`
    }, { ipfs })

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
    await http({
      method: 'POST',
      url: `/api/v0/files/touch?arg=${path}&mtime=${mtime}&shardSplitThreshold=10`
    }, { ipfs })

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
