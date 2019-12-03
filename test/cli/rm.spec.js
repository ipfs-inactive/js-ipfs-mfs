/* eslint-env mocha */
'use strict'

const expect = require('../helpers/chai')
const cli = require('../helpers/cli')
const sinon = require('sinon')

describe('cli rm', () => {
  let ipfs

  beforeEach(() => {
    ipfs = {
      files: {
        rm: sinon.stub().resolves()
      }
    }
  })

  it('should remove a path', async () => {
    const path = '/foo'

    await cli(`files rm ${path}`, { ipfs })

    expect(ipfs.files.rm.callCount).to.equal(1)
    expect(ipfs.files.rm.getCall(0).args).to.deep.equal([
      path, {
        recursive: false
      }
    ])
  })

  it('should remove a path recursively', async () => {
    const path = '/foo'

    await cli(`files rm --recursive ${path}`, { ipfs })

    expect(ipfs.files.rm.callCount).to.equal(1)
    expect(ipfs.files.rm.getCall(0).args).to.deep.equal([
      path, {
        recursive: true
      }
    ])
  })

  it('should remove a path recursively (short option)', async () => {
    const path = '/foo'

    await cli(`files rm -r ${path}`, { ipfs })

    expect(ipfs.files.rm.callCount).to.equal(1)
    expect(ipfs.files.rm.getCall(0).args).to.deep.equal([
      path, {
        recursive: true
      }
    ])
  })
})
