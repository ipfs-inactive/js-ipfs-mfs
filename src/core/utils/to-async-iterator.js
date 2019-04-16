'use strict'

const errCode = require('err-code')
const fs = require('fs')
const log = require('debug')('ipfs:mfs:utils:to-pull-source')
const {
  MAX_CHUNK_SIZE
} = require('./constants')

const toAsyncIterator = async (content) => {
  if (!content) {
    throw errCode(new Error('paths must start with a leading /'), 'EINVALIDPATH')
  }

  if (typeof content === 'string' || content instanceof String) {
    // Paths, node only
    log('Content was a path')

    return fs.createReadStream(content)
  }

  if (content.length) {
    log('Content was array-like')

    return {
      [Symbol.asyncIterator]: async function * bufferContent () {
        yield content
      }
    }
  }

  if (content[Symbol.asyncIterator]) {
    log('Content was an async iterator')
    return content
  }

  if (content[Symbol.iterator]) {
    log('Content was an iterator')
    return content
  }

  if (global.Blob && content instanceof global.Blob) {
    // HTML5 Blob objects (including Files)
    log('Content was an HTML5 Blob')

    let index = 0

    const iterator = {
      next: async () => {
        if (index > content.size) {
          return {
            done: true
          }
        }

        return new Promise((resolve, reject) => {
          const chunk = content.slice(index, MAX_CHUNK_SIZE)
          index += MAX_CHUNK_SIZE

          const reader = new global.FileReader()

          const handleLoad = (ev) => {
            reader.removeEventListener('loadend', handleLoad, false)

            if (ev.error) {
              return reject(ev.error)
            }

            resolve({
              done: false,
              value: Buffer.from(reader.result)
            })
          }

          reader.addEventListener('loadend', handleLoad)
          reader.readAsArrayBuffer(chunk)
        })
      }
    }

    return {
      [Symbol.asyncIterator]: () => {
        return iterator
      }
    }
  }

  throw errCode(new Error(`Don't know how to convert ${content} into an async iterator`), 'EINVALIDPARAMS')
}

module.exports = toAsyncIterator
