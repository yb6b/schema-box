/** 字频统计和词频统计公用的方法 */

import { KEYS } from '../feeling-data/combo'
import { CollisionCounter } from '../simulator/collision-counter'
import { comboFeelData } from '../feeling-data'
import type { EvaluateLineHanzi } from './hanzi'
import type { EvaluateLineWords } from './words'
import type { Mabiao, MabiaoItem } from '@/libs/schema'
import { parseTsv, zipObjects } from '@/libs/utils'

export function getTotalUsage(evaluateResult: EvaluateLineHanzi[] | EvaluateLineWords[]) {
  const totalUsage = { ...evaluateResult[0].usage }
  for (let i = 1; i < evaluateResult.length; i++) {
    const e = evaluateResult[i]
    for (const [k, n] of Object.entries(e.usage)) {
      const newFreq = totalUsage[k] ?? 0
      totalUsage[k] = newFreq + n
    }
  }
  return totalUsage
}

export const keys46Set = new Set(KEYS)

/** 获取字频数据 */
export type FreqMatrix = [string, number][]
export function parseFreqTsv(tsv: string): FreqMatrix {
  const matrix = parseTsv(tsv)
  return matrix.map(v => [v[0], Number.parseInt(v[1])])
}

export type HanziMap = Map<string, { item: MabiaoItem, collision: number }>
/**
 * 提取码表中的单字数据
 * @param mb 从哪个码表里提取单字数据
 * @param hanzi 要提取哪些汉字
 * @param [shortCode] 遇到一字多码时, 保留较短的那个？
 * @returns - 单字相关数据
 */
export function hanziMapFromMb(mb: Mabiao, hanzi: Iterable<string>, shortCode = true): HanziMap {
  const rs: HanziMap = new Map()
  const hanziSet = new Set(hanzi)
  const collisionCounter = new CollisionCounter()
  for (const item of mb.items) {
    const wd = item[0]
    const cd = item[1]
    // 过滤不必要的汉字
    if (wd.length > 1 || !hanziSet.has(wd))
      continue
    const oldItem = rs.get(wd)
    // 没有数据时, 添加数据
    if (!oldItem) {
      rs.set(wd, { item, collision: collisionCounter.add(cd) })
      continue
    }
    // 有数据时
    // 单字测评取码长更短的
    if (shortCode) {
      if (oldItem.item[1].length > cd.length) {
        const collision = collisionCounter.add(cd)
        rs.set(wd, { item, collision })
      }
    }
    // 词语测评取码长更长的
    else {
      if (oldItem.item[1].length < cd.length) {
        const collision = collisionCounter.add(cd)
        rs.set(wd, { item, collision })
      }
    }
  }
  return rs
}

/** 合并多个计算结果 */
export function zipEvaluationItems<T extends EvaluateLineHanzi | EvaluateLineWords>(items: T[]): T {
  const len = items.length
  if (len === 1)
    return items[0]
  const rs = zipObjects(items)
  rs.start = items[0].start
  rs.end = items[len - 1].end
  return rs
}

export function totalFreqFromKeysUsages(usage: Map<string, number>) {
  let rs = 0
  for (const e of usage.values())
    rs += e
  return rs
}

/** 计算陈一凡当量。调用前, 要先处理码长1的情况 */
export function calcEq(cd: string) {
  let rs = 0
  for (let i = 1; i < cd.length; i++) {
    const combo = cd[i - 1] + cd[i]
    rs += comboFeelData[combo].eq
  }
  return rs
}

/** 排除缺字和超标 */
export function isNormal<T>(evaluteItem: T) {
  // @ts-expect-error undefined magic
  return evaluteItem.overKey === 0
}
