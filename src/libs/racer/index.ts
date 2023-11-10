import type { Schema } from '../schema'
import { CollisionCalculator, UniqueTrieTree } from './uniqueTrieTree'
import { generateSegmentGreedily } from './segmentation'
import { SegmentAnalyser } from './segAnalysis'

/**
 * 根据一个方案和文章开始赛码。
 * @param aSchema 被测试的方案
 * @param article 文章
 * @param options 处理中断信号
 * @returns 赛码测评的结果
 */
export function calcSchema(aSchema: Schema, article: string) {
  const utt = new UniqueTrieTree(true)
  const cc = new CollisionCalculator()

  const dict = aSchema.dicts[0].items
  for (const i of dict) {
    const collisionCount = cc.add(i.code)
    utt.add(i.words, { code: i.code, line: i.line, collision: collisionCount, prefixeeLen: 0 })
  }

  const sa = new SegmentAnalyser(aSchema.cfg?.selectKeys, aSchema.cfg?.cmLen)
  for (const i of generateSegmentGreedily(article, utt))
    sa.add(i)

  return sa.result
}
