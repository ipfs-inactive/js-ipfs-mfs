'use strict'

const {
  asBoolean
} = require('./utils')

module.exports = {
  command: 'touch [path]',

  describe: 'change file modification times',

  builder: {
    flush: {
      alias: 'f',
      type: 'boolean',
      default: true,
      coerce: asBoolean,
      describe: 'Flush the changes to disk immediately'
    },
    'shard-split-threshold': {
      type: 'number',
      default: 1000,
      describe: 'If a directory has more links than this, it will be transformed into a hamt-sharded-directory'
    },
    'cid-version': {
      alias: ['cid-ver'],
      type: 'number',
      default: 0,
      describe: 'Cid version to use'
    },
    mtime: {
      alias: 'm',
      type: 'number',
      default: parseInt(Date.now() / 1000),
      describe: 'Time to use as the new modification time'
    }
  },

  handler (argv) {
    const {
      path,
      getIpfs,
      flush,
      shardSplitThreshold,
      cidVersion,
      mtime
    } = argv

    argv.resolve((async () => {
      const ipfs = await getIpfs()

      return ipfs.files.touch(path, mtime, {
        flush,
        shardSplitThreshold,
        cidVersion
      })
    })())
  }
}
