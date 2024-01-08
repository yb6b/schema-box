import type { Mabiao } from 'libs/schema'
import { getMaxCodeLen, getMaxWordsLen } from 'libs/schema'
import type { UniqueTrieTree } from './uniqueTrieTree'
import { treeAdd } from './uniqueTrieTree'
import { CollisionCounter } from './collisionCounter'
import { Segment } from './segmentation'
import { AnalysisResult } from './analysisResult'

export function simulateSchema(mb: Mabiao, article: string) {
  const tree: UniqueTrieTree = new Map()
  const collisionCounter = new CollisionCounter()
  const dictItems = mb.items
  for (const i of dictItems)
    treeAdd(tree, i, collisionCounter.add(i[1]))

  const maxCL = getMaxCodeLen(mb)
  const maxWL = getMaxWordsLen(mb)
  const result = new AnalysisResult(collisionCounter.max, maxWL, maxCL)

  if (mb.selectKeys)
    result.collisionKeys = mb.selectKeys
  if (mb.cmLen)
    result.commitLength = mb.cmLen

  const segment = new Segment(tree, article)
  let n = segment.next()
  while (n !== -1) {
    result.add(segment)
    n = segment.next()
  }
  return result.reform()
}
