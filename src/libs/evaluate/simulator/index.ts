import type { Mabiao } from 'libs/schema'
import { maxCodeLen, maxWordsLen } from 'libs/schema'
import type { UniqueTrieTree } from './uniqueTrieTree'
import { treeAdd } from './uniqueTrieTree'
import { CollisionCounter } from './collisionCounter'
import { Segment } from './segmentation'
import { AnalysisResult } from './analysisResult'

export function simulateSchema(mb: Mabiao, article: string): AnalysisResult {
  const tree: UniqueTrieTree = new Map()
  const collisionCounter = new CollisionCounter()
  const dictItems = mb.items
  for (const i of dictItems)
    treeAdd(tree, i, collisionCounter.add(i[1]))

  const maxCL = mb.maxCodeLen || maxCodeLen(dictItems)
  const maxWL = mb.maxWordsLen || maxWordsLen(dictItems)
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
  result.reform()
  return result
}
