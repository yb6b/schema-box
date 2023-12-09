import type { Schema } from 'libs/schema'
import { maxCodeLen, maxWordsLen } from 'libs/schema/dictUtils'
import type { UniqueTrieTree } from './uniqueTrieTree'
import { treeAdd } from './uniqueTrieTree'
import { CollisionCounter } from './collisionCounter'
import { Segment } from './segmentation'
import { AnalysisResult } from './analysisResult'

export function simulateSchema(aSchema: Schema, article: string): AnalysisResult {
  const tree: UniqueTrieTree = new Map()
  const collisionCounter = new CollisionCounter()
  const dict = aSchema.dicts[0]
  const dictItems = dict.items
  for (const i of dictItems)
    treeAdd(tree, i, collisionCounter.add(i[1]))

  const maxCL = dict.maxCodeLen || maxCodeLen(dictItems)
  const maxWL = dict.maxWordsLen || maxWordsLen(dictItems)
  const result = new AnalysisResult(collisionCounter.max, maxWL, maxCL)

  if (aSchema.cfg?.selectKeys)
    result.collisionKeys = aSchema.cfg.selectKeys
  if (aSchema.cfg?.cmLen)
    result.commitLength = aSchema.cfg.cmLen

  const segment = new Segment(tree, article)
  let n = segment.next()
  while (n !== -1) {
    result.add(segment)
    n = segment.next()
  }
  result.reform()
  return result
}
