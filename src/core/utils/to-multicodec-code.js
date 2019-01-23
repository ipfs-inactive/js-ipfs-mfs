'use strict'

const multicodec = require('multicodec')

// Converts a multicodec name to the corresponding code if it isn't a code
// already
const toMulticodecCode = (name) => {
  if (typeof name === 'string') {
    const constantName = name.toUpperCase().replace(/-/g, '_')
    return multicodec[constantName]
  } else {
    return name
  }
}

module.exports = toMulticodecCode
