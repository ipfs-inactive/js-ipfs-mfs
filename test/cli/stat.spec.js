/* eslint-env mocha */
'use strict'

const expect = require('../helpers/chai')
const cli = require('../helpers/cli')
const sinon = require('sinon')

describe('cli stat', () => {
  let ipfs
  let print
  let output

  beforeEach(() => {
    output = ''
    ipfs = {
      files: {
        stat: sinon.stub().resolves({
          hash: 'stats-hash',
          size: 'stats-size',
          cumulativeSize: 'stats-cumulativeSize',
          blocks: 'stats-blocks',
          type: 'stats-type',
          mode: 'stats-mode',
          mtime: 'stats-mtime'
        })
      }
    }
    print = (msg = '', newline = true) => {
      output += newline ? msg + '\n' : msg
    }
  })

  it('should stat a path', async () => {
    const path = '/foo'

    await cli(`files stat ${path}`, { ipfs, print })

    expect(ipfs.files.stat.callCount).to.equal(1)
    expect(ipfs.files.stat.getCall(0).args).to.deep.equal([
      path, {
        withLocal: false
      }
    ])
    expect(output).to.include('CumulativeSize')
  })

  it('should stat a path with local', async () => {
    const path = '/foo'

    await cli(`files stat --with-local ${path}`, { ipfs, print })

    expect(ipfs.files.stat.callCount).to.equal(1)
    expect(ipfs.files.stat.getCall(0).args).to.deep.equal([
      path, {
        withLocal: true
      }
    ])
    expect(output).to.include('CumulativeSize')
  })

  it('should stat a path with local (short option)', async () => {
    const path = '/foo'

    await cli(`files stat -l ${path}`, { ipfs, print })

    expect(ipfs.files.stat.callCount).to.equal(1)
    expect(ipfs.files.stat.getCall(0).args).to.deep.equal([
      path, {
        withLocal: true
      }
    ])
    expect(output).to.include('CumulativeSize')
  })

  it('should stat a path and only show hashes', async () => {
    const path = '/foo'

    await cli(`files stat --hash ${path}`, { ipfs, print })

    expect(ipfs.files.stat.callCount).to.equal(1)
    expect(ipfs.files.stat.getCall(0).args).to.deep.equal([
      path, {
        withLocal: false
      }
    ])
    expect(output).to.equal('stats-hash\n')
  })

  it('should stat a path and only show hashes (short option)', async () => {
    const path = '/foo'

    await cli(`files stat -h ${path}`, { ipfs, print })

    expect(ipfs.files.stat.callCount).to.equal(1)
    expect(ipfs.files.stat.getCall(0).args).to.deep.equal([
      path, {
        withLocal: false
      }
    ])
    expect(output).to.equal('stats-hash\n')
  })

  it('should stat a path and only show sizes', async () => {
    const path = '/foo'

    await cli(`files stat --size ${path}`, { ipfs, print })

    expect(ipfs.files.stat.callCount).to.equal(1)
    expect(ipfs.files.stat.getCall(0).args).to.deep.equal([
      path, {
        withLocal: false
      }
    ])
    expect(output).to.equal('stats-size\n')
  })

  it('should stat a path and only show sizes (short option)', async () => {
    const path = '/foo'

    await cli(`files stat -s ${path}`, { ipfs, print })

    expect(ipfs.files.stat.callCount).to.equal(1)
    expect(ipfs.files.stat.getCall(0).args).to.deep.equal([
      path, {
        withLocal: false
      }
    ])
    expect(output).to.equal('stats-size\n')
  })

  it('should stat a path with format option', async () => {
    const path = '/foo'

    await cli(`files stat --format '<mode> <type>' ${path}`, { ipfs, print })

    expect(ipfs.files.stat.callCount).to.equal(1)
    expect(ipfs.files.stat.getCall(0).args).to.deep.equal([
      path, {
        withLocal: false
      }
    ])
    expect(output).to.equal('stats-mode stats-type\n')
  })
})
