import type { Mabiao } from 'libs/schema'
import { getMaxCodeLen, getMaxWordsLen, getSelectKeys } from 'libs/schema'
import type { ShallowRef } from 'vue'
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

interface SimulateSchemasAbortableProps {
  article: string
  mb: Mabiao
  /** 如果要中断运算，使用方设置为true，程序会尽快退出 */
  shouldAbort: boolean
  /** 已经计算过的词条与文章字数之和，用户只读 */
  alreadyCount: ShallowRef<number>
}
export async function simulateSchemasAbortable(opt: SimulateSchemasAbortableProps) {
  const mb = opt.mb
  const dictItems = mb.items
  const mbLen = dictItems.length

  opt.alreadyCount.value = 0
  const timesBetweenCheck = 600

  // 添加字典树
  const tree: UniqueTrieTree = new Map()
  const collisionCounter = new CollisionCounter()

  // 所有词条
  for (let i = 0; i < mbLen; i += timesBetweenCheck) {
    if (opt.shouldAbort)
      return undefined
      // 每个迭代循环
    for (let a = 0; a < timesBetweenCheck; a++) {
      const element = dictItems[i + a]
      if (!element)
        break
      treeAdd(tree, element, collisionCounter.add(element[1]), true)
    }
    opt.alreadyCount.value += timesBetweenCheck
    await nextRace()
  }

  // 统计数据
  const maxCL = getMaxCodeLen(mb)
  const maxWL = getMaxWordsLen(mb)
  const result = new AnalysisResult(collisionCounter.max, maxWL, maxCL)
  result.collisionKeys = getSelectKeys(mb)
  if (mb.cmLen)
    result.commitLength = mb.cmLen
  const segment = new Segment(tree, opt.article)
  while (true) {
    if (opt.shouldAbort)
      return undefined
    let n = -1
    for (let i = 0; i < timesBetweenCheck; i++) {
      n = segment.next()
      if (n === -1)
        break
      result.add(segment)
    }
    if (n === -1)
      break
    opt.alreadyCount.value = mbLen + n
    await nextRace()
  }
  return result.reform()
}

function nextRace() {
  return new Promise<void>((res) => {
    setTimeout(() => {
      res()
    }, 0)
  })
}
