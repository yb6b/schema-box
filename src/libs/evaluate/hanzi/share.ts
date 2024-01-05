/** 字频统计和词频统计公用的方法 */

import { parseTsv } from 'libs/utils'
import type { Mabiao, MabiaoItem } from 'libs/schema'
import { KEYS } from '../feelData/combo'
import { CollisionCounter } from '../simulator/collisionCounter'
import { comboFeelData } from '../feelData'
import type { EvaluateBaseItem, EvaluateHanziItem } from './hanzi'
import type { EvaluateWordsItem } from './words'

export const keys46Set = new Set(KEYS)

/** 获取字频数据 */
export type FreqMatrix = [string, number][]
export function parseFreqTsv(tsv: string): FreqMatrix {
  const matrix = parseTsv(tsv)
  if (matrix.length < 6000)
    throw new Error('字频数据少于6000行')
  return matrix.map(v => [v[0], Number.parseInt(v[1])])
}

export type HanziMap = Map<string, { item: MabiaoItem; collision: number }>
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
    // 过滤不必要的汉字
    if (wd.length > 1 || !hanziSet.has(wd))
      continue
    const oldItem = rs.get(wd)
    // 没有数据时, 添加数据
    if (!oldItem) {
      rs.set(wd, { item, collision: 1 })
      continue
    }
    // 有数据时
    // 单字测评取码长更短的
    if (shortCode) {
      if (oldItem.item[1].length > item[1].length) {
        const collision = collisionCounter.add(item[1])
        rs.set(wd, { item, collision })
      }
    }
    // 词语测评取码长更长的
    else {
      if (oldItem.item[1].length < item[1].length) {
        const collision = collisionCounter.add(item[1])
        rs.set(wd, { item, collision })
      }
    }
  }
  return rs
}

/** 合并多个计算结果 */
export function zipEvaluationItems<T extends object>(items: T[]): T {
  if (items.length < 2)
    return items[0]
  const mergeObjectToBase = (base: object, other: object) => {
    for (const [k, v] of Object.entries(other)) {
      if (Array.isArray(v)) {
        // @ts-expect-error magic
        base[k] = base[k].concat(v)
      }
      else if (typeof v === 'number') {
        if (k in base)
        // @ts-expect-error magic
          base[k] += v
        else
        // @ts-expect-error magic
          base[k] = v
      }
      // 对象
      else {
        // @ts-expect-error magic
        mergeObjectToBase(base[k], v)
      }
    }
  }
  const rs = structuredClone(items[0])
  for (let i = 1; i < items.length; i++) {
    const e = items[i]
    mergeObjectToBase(rs, e)
  }
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
