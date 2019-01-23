'use strict'

const printTree = async (ipld, cid, indentation = '', name = '') => {
  console.info(indentation, name, cid.toBaseEncodedString()) // eslint-disable-line no-console

  const node = await ipld.get(cid)
  const fileLinks = node.links
    .filter(link => link.name)

  for (let i = 0; i < fileLinks.length; i++) {
    await printTree(ipld, fileLinks[i].cid, `  ${indentation}`, fileLinks[i].name)
  }
}

module.exports = printTree
