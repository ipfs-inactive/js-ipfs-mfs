'use strict'

module.exports = async function * traverseLeafNodes (mfs, cid) {
  async function *  traverse (cid) {
    const node = await mfs.ipld.get(cid)

    if (Buffer.isBuffer(node) || !node.links.length) {
      yield {
        node,
        cid
      }

      return
    }

    node.links.forEach(link => traverse(link.cid))
  }

  return traverse(cid)
}
