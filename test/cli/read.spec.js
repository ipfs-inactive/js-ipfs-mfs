/* eslint-env mocha */
'use strict'

const expect = require('../helpers/chai')
const cli = require('../helpers/cli')
const sinon = require('sinon')
const values = require('pull-stream/sources/values')

describe('cli read', () => {
  let ipfs
  let print
  let output

  beforeEach(() => {
    output = ''
    ipfs = {
      files: {
        readPullStream: sinon.stub().returns(values(['hello world']))
      }
    }
    print = (msg = '', newline = true) => {
      output += newline ? msg + '\n' : msg
    }
  })

  it('should read a path', async () => {
    const path = '/foo'

    await cli(`files read ${path}`, { ipfs, print })

    expect(ipfs.files.readPullStream.callCount).to.equal(1)
    expect(ipfs.files.readPullStream.getCall(0).args).to.deep.equal([
      path, {
        offset: undefined,
        length: undefined
      }
    ])
    expect(output).to.equal('hello world')
  })

  it('should read a path with an offset', async () => {
    const path = '/foo'
    const offset = 5

    await cli(`files read --offset ${offset} ${path}`, { ipfs, print })

    expect(ipfs.files.readPullStream.callCount).to.equal(1)
    expect(ipfs.files.readPullStream.getCall(0).args).to.deep.equal([
      path, {
        offset,
        length: undefined
      }
    ])
    expect(output).to.equal('hello world')
  })

  it('should read a path with an offset (short option)', async () => {
    const path = '/foo'
    const offset = 5

    await cli(`files read -o ${offset} ${path}`, { ipfs, print })

    expect(ipfs.files.readPullStream.callCount).to.equal(1)
    expect(ipfs.files.readPullStream.getCall(0).args).to.deep.equal([
      path, {
        offset,
        length: undefined
      }
    ])
    expect(output).to.equal('hello world')
  })

  it('should read a path with an length', async () => {
    const path = '/foo'
    const length = 5

    await cli(`files read --length ${length} ${path}`, { ipfs, print })

    expect(ipfs.files.readPullStream.callCount).to.equal(1)
    expect(ipfs.files.readPullStream.getCall(0).args).to.deep.equal([
      path, {
        offset: undefined,
        length
      }
    ])
    expect(output).to.equal('hello world')
  })

  it('should read a path with an length (short option)', async () => {
    const path = '/foo'
    const length = 5

    await cli(`files read -l ${length} ${path}`, { ipfs, print })

    expect(ipfs.files.readPullStream.callCount).to.equal(1)
    expect(ipfs.files.readPullStream.getCall(0).args).to.deep.equal([
      path, {
        offset: undefined,
        length
      }
    ])
    expect(output).to.equal('hello world')
  })
})
