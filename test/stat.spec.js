/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const path = require('path')
const loadFixture = require('aegir/fixtures')

const {
  createMfs,
  createShardedDirectory,
  EMPTY_DIRECTORY_HASH,
  EMPTY_DIRECTORY_HASH_BASE64URL
} = require('./helpers')

describe('stat', () => {
  let mfs
  let smallFile = loadFixture(path.join('test', 'fixtures', 'small-file.txt'))
  let largeFile = loadFixture(path.join('test', 'fixtures', 'large-file.jpg'))

  before(async () => {
    mfs = await createMfs()
  })

  it('refuses to stat files with an empty path', async () => {
    try {
      await mfs.stat('')
      throw new Error('No error was thrown for an empty path')
    } catch (err) {
      expect(err.message).to.contain('paths must not be empty')
    }
  })

  it('refuses to lists files with an invalid path', async () => {
    try {
      await mfs.stat('not-valid')
      throw new Error('No error was thrown for an empty path')
    } catch (err) {
      expect(err.message).to.contain('paths must start with a leading /')
    }
  })

  it('fails to stat non-existent file', async () => {
    try {
      await mfs.stat('/i-do-not-exist')
      throw new Error('No error was thrown for a non-existent file')
    } catch (err) {
      expect(err.message).to.contain('does not exist')
    }
  })

  it('stats an empty directory', async () => {
    const path = `/directory-${Math.random()}`

    await mfs.mkdir(path)

    const stats = await mfs.stat(path)
    expect(stats.size).to.equal(0)
    expect(stats.cumulativeSize).to.equal(4)
    expect(stats.blocks).to.equal(0)
    expect(stats.type).to.equal('directory')
  })

  it('returns only a hash', async () => {
    const path = `/directory-${Math.random()}`

    await mfs.mkdir(path)

    const stats = await mfs.stat(path, {
      hash: true
    })

    expect(Object.keys(stats).length).to.equal(1)
    expect(stats.hash).to.equal(EMPTY_DIRECTORY_HASH)
  })

  it('returns only a base64url hash', async () => {
    const path = `/directory-${Math.random()}`

    await mfs.mkdir(path)

    const stats = await mfs.stat(path, {
      hash: true,
      cidBase: 'base64url'
    })

    expect(Object.keys(stats).length).to.equal(1)
    expect(stats.hash).to.equal(EMPTY_DIRECTORY_HASH_BASE64URL)
  })

  it('returns only the size', async () => {
    const path = `/directory-${Math.random()}`

    await mfs.mkdir(path)

    const stats = await mfs.stat(path, {
      size: true
    })

    expect(Object.keys(stats).length).to.equal(1)
    expect(stats.size).to.equal(4) // protobuf size?!
  })

  it.skip('computes how much of the DAG is local', async () => {

  })

  it('stats a small file', async () => {
    const filePath = '/stat/small-file.txt'

    await mfs.write(filePath, smallFile, {
      create: true,
      parents: true
    })

    const stats = await mfs.stat(filePath)
    expect(stats.size).to.equal(smallFile.length)
    expect(stats.cumulativeSize).to.equal(73)
    expect(stats.blocks).to.equal(1)
    expect(stats.type).to.equal('file')
  })

  it('stats a large file', async () => {
    const filePath = '/stat/large-file.txt'

    await mfs.write(filePath, largeFile, {
      create: true,
      parents: true
    })

    const stats = await mfs.stat(filePath)
    expect(stats.size).to.equal(largeFile.length)
    expect(stats.cumulativeSize).to.equal(490804)
    expect(stats.blocks).to.equal(2)
    expect(stats.type).to.equal('file')
  })

  it('stats a large file with base64url', async () => {
    const filePath = '/stat/large-file.txt'

    await mfs.write(filePath, largeFile, {
      create: true,
      parents: true
    })

    const stats = await mfs.stat(filePath, {
      cidBase: 'base64url'
    })
    expect(stats.hash.startsWith('u')).to.equal(true)
    expect(stats.size).to.equal(largeFile.length)
    expect(stats.cumulativeSize).to.equal(490804)
    expect(stats.blocks).to.equal(2)
    expect(stats.type).to.equal('file')
  })

  it('stats a sharded directory', async () => {
    const shardedDirPath = await createShardedDirectory(mfs)

    const stats = await mfs.stat(`${shardedDirPath}`)

    expect(stats.type).to.equal('hamt-sharded-directory')
    expect(stats.size).to.equal(0)
  })

  it('stats a file inside a sharded directory', async () => {
    const shardedDirPath = await createShardedDirectory(mfs)
    const files = await mfs.ls(`${shardedDirPath}`)
    const stats = await mfs.stat(`${shardedDirPath}/${files[0].name}`)

    expect(stats.type).to.equal('file')
    expect(stats.size).to.equal(7)
  })
})
