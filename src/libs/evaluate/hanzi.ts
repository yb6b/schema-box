/** 根据字频表数据测评, 即科学形码测评系统 */

import { parseTsv } from 'libs/utils'
import type { Mabiao, MabiaoItem } from '../schema'
import { comboFeelData } from './feelData'
import { CollisionCounter } from './simulator/collisionCounter'
import { KEYS } from './feelData/combo'

const keys46Set = new Set(KEYS)

export const presetHanziFreq = (await import('./hanziFreq')).default

/** 获取字频数据 */
type FreqMatrix = [string, number][]
export function parseFreqTsv(tsv: string): FreqMatrix {
  const matrix = parseTsv(tsv)
  if (matrix.length < 6000)
    throw new Error('字频数据少于6000行')
  return matrix.map(v => [v[0], Number.parseInt(v[1])])
}

type HanziMap = Map<string, { item: MabiaoItem; collision: number }>
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

/** 调用前, 要先处理码长1的情况 */
export function calcEq(cd: string) {
  let rs = 0
  for (let i = 1; i < cd.length; i++) {
    const combo = cd[i - 1] + cd[i]
    rs += comboFeelData[combo].eq
  }
  return rs
}

/** 合并多个计算结果 */
export function zipEvaluationItems<T extends object>(items: T[]): T {
  if (items.length < 2)
    return items[0]
  const rs = { ...items[0] }
  for (let i = 1; i < items.length; i++) {
    const e = items[i]
    for (const [k, v] of Object.entries(e)) {
      if (Array.isArray(v)) {
        // @ts-expect-error magic
        rs[k] = rs[k].concat(v)
      }
      if (typeof v === 'number') {
        // @ts-expect-error magic
        rs[k] += v
      }
    }
  }
  return rs
}

/** 计算加权行 传入合计过的 */
export function calcWeightedEvalItems(item: EvaluateItems) {
  const rs: any = {}
  const totalFreq = item.freq
  for (const [k, v] of Object.entries(item)) {
    if (Array.isArray(v)) {
      let f = 0
      for (const e of v) {
        const x = 'count' in e ? e.count : 1
        f += (e.freq * x) / totalFreq
      }
      rs[k] = f
    }
  }
  return rs
}

export function keysUsage<T extends { code: string; selectKey: string; freq: number }>(purifiedMabiao: T[]) {
  const keyUsage = new Map<string, number>()
  for (const e of purifiedMabiao) {
    for (const key of e.code) {
      const oldUsage = keyUsage.get(key) ?? 0
      keyUsage.set(key, oldUsage + e.freq)
    }
    if (e.selectKey.length) {
      const key = e.selectKey[0]
      const oldUsage = keyUsage.get(key) ?? 0
      keyUsage.set(key, oldUsage + e.freq)
    }
  }
  return keyUsage
}

export function totalFreqFromKeysUsages(usage: Map<string, number>) {
  let rs = 0
  for (const e of usage.values())
    rs += e
  return rs
}

///  单字测评专用的  ///

interface PurifiedMbItemBase {
  /** 词语 */
  wd: string
  /** 频数 */
  freq: number
  /** 全局频率 */
  reFreq: number
  /** 字频排名 */
  freqRank: number
}

interface PurifiedMbItemNormal extends PurifiedMbItemBase {
  /** 编码 */
  code: string
  /** 行数 */
  line: number
  /** 选重数 */
  collision: number
  /** 选重键, 空字符串表示可以直接上屏 */
  selectKey: string
}

type PurifiedMbItem = PurifiedMbItemBase | PurifiedMbItemNormal

/** 提取单字测评用的数据 */
export function purifyMabiao(hanziMap: HanziMap, freqMatrix: FreqMatrix): PurifiedMbItem[] {
  const rs: PurifiedMbItem[] = []
  let totalFreq = 0
  let rank = 0
  for (const [wd, freq] of freqMatrix) {
    rank++
    totalFreq += freq
    if (hanziMap.has(wd)) {
      const { item, collision } = hanziMap.get(wd)!
      rs.push({
        wd,
        freq,
        reFreq: 0,
        code: item[1],
        line: item[2],
        collision,
        selectKey: '',
        freqRank: rank,
      })
    }
    // 缺字
    else {
      rs.push({
        wd,
        freq,
        reFreq: 0,
        freqRank: rank,
      })
    }
  }
  // 补齐频率
  for (const e of rs)
    e.reFreq = e.freq / totalFreq
  return rs
}

/** 带有计数, 用于收集手感 */
type PurifiedMbItemAndCount = PurifiedMbItemNormal & { count: number }
export interface EvaluateItems {
  /** 总频数 */
  freq: number
  /** 1码 */
  L1: Array<PurifiedMbItem>
  /** 2码 */
  L2: Array<PurifiedMbItem>
  /** 3码 */
  L3: Array<PurifiedMbItem>
  /** 4码 */
  L4: Array<PurifiedMbItem>
  /** 更多 */
  LMore: Array<PurifiedMbItem>
  /** 选重 */
  collision: Array<PurifiedMbItem>
  /** 理论二简 */
  brief2: Array<PurifiedMbItem>
  /** 加权键长, 使用时要除以总频数 */
  CL: number
  /** 加权字均当量, 使用时要除以总频数 */
  ziEq: number
  /** 加权键均当量, 使用时要除以总频数 */
  keyEq: number
  /** 左右互击 */
  dh: Array<PurifiedMbItemAndCount>
  /** 同指大跨排 */
  ms: Array<PurifiedMbItemAndCount>
  /** 同指小跨排 */
  ss: Array<PurifiedMbItemAndCount>
  /** 小指干扰 */
  pd: Array<PurifiedMbItemAndCount>
  /** 错手 */
  lfd: Array<PurifiedMbItemAndCount>
  /** 三连击 */
  trible: Array<PurifiedMbItemAndCount>
  /** 超标键位 */
  overKey: Array<PurifiedMbItemAndCount>
  /** 缺字 */
  lack: Array<PurifiedMbItemBase>
}

function createEmptyEvaluateItems(): EvaluateItems {
  return {
    freq: 0,
    L1: [],
    L2: [],
    L3: [],
    L4: [],
    LMore: [],
    collision: [],
    brief2: [],
    CL: 0,
    ziEq: 0,
    keyEq: 0,
    dh: [],
    ms: [],
    ss: [],
    pd: [],
    lfd: [],
    trible: [],
    overKey: [],
    lack: [],
  }
}
/** 测评5个区间，会修改purifiedMb里的selectKey数据 */
export function evaluateSections(purifiedMb: PurifiedMbItem[], mb: Mabiao) {
  // 用于选重键
  const { maxCodeLen, selectKeys } = mb
  const sections = [[0, 300], [300, 500], [500, 1500], [1500, 3000], [3000, 6000]] as const
  const rs: EvaluateItems[] = []
  // 用于计算理论二简
  const brief2Set = new Set<string>()
  for (const [a, b] of sections) {
    const sectionRs = createEmptyEvaluateItems()
    for (let i = a; i < b; i++) {
      const el = purifiedMb[i]
      // 缺字
      if (!('code' in el)) {
        sectionRs.lack.push(el)
        continue
      }

      const cd = el.code
      const cdLen = cd.length

      // 补齐el的键长数据
      const selectKeyLen = selectKeys!.length
      if (maxCodeLen! > cdLen || el.collision > 1) {
        const coll = el.collision > selectKeyLen ? selectKeyLen : el.collision
        el.selectKey = selectKeys![coll - 1]
      }

      // 超标键位
      let overKeyCount = 0
      for (const e of cd) {
        if (!keys46Set.has(e))
          overKeyCount++
      }
      if (overKeyCount) {
        sectionRs.overKey.push({ ...el, count: overKeyCount })
        continue
      }

      // 区间字频合计
      sectionRs.freq += el.freq

      // 1码 2码 3码 4码 更多码长
      switch (cdLen) {
        case 1:
          sectionRs.L1.push(el)
          break
        case 2:
          sectionRs.L2.push(el)
          break
        case 3:
          sectionRs.L3.push(el)
          break
        case 4:
          sectionRs.L4.push(el)
          break
        default:
          sectionRs.LMore.push(el)
          break
      }

      // 选重
      if (el.collision > 1)
        sectionRs.collision.push(el)

      // 理论二简
      const code2 = cd.slice(0, 2)
      if (!brief2Set.has(code2)) {
        brief2Set.add(code2)
        sectionRs.brief2.push(el)
      }

      // 互击 大跨排 小跨排 小指干扰 错手
      const comboKeys = ['dh', 'ms', 'ss', 'pd', 'lfd'] as const
      for (const e of comboKeys) {
        let count = 0
        for (let i = 1; i < cd.length; i++) {
          const combo = cd[i - 1] + cd[i]
          if (comboFeelData[combo]![e])
            count++
        }
        if (count > 0)
          sectionRs[e].push({ ...el, count })
      }

      // 三连击
      let count = 0
      for (let i = 2; i < cdLen; i++) {
        if (cd[i - 2] === cd[i - 1] && cd[i - 1] === cd[i])
          count++
      }
      if (count > 0)
        sectionRs.trible.push({ ...el, count })

      const freq = el.freq
      // 字均当量
      // 1 码字的当量为 1
      const ziEq = cdLen < 2 ? 1 : calcEq(cd)
      sectionRs.ziEq += ziEq * freq

      const codeWithSelectKey = cd + el.selectKey
      const keysLen = codeWithSelectKey.length

      // 加权键长
      sectionRs.CL += keysLen * freq

      // 键均当量
      // 1 键字的当量为 1
      if (keysLen < 2) {
        sectionRs.keyEq += freq
      }
      else {
        const keyEq = calcEq(codeWithSelectKey)
        sectionRs.keyEq += (keyEq / (keysLen - 1)) * freq
      }
    }
    rs.push(sectionRs)
  }
  return rs
}

/** 用默认的字频表分析特定的码表 */
export function quickEvaluate(mb: Mabiao) {
  const freqTsv = parseFreqTsv(presetHanziFreq)
  const hanzi_map = hanziMapFromMb(mb, freqTsv.map(v => v[0]))
  const purifiedMb = purifyMabiao(hanzi_map, freqTsv)
  const evaluate = evaluateSections(purifiedMb, mb)
  const normalPurified = purifiedMb.filter(v => ('code' in v)) as PurifiedMbItemNormal[]
  const usage = keysUsage(normalPurified)
  const total_usage_count = totalFreqFromKeysUsages(usage)
  for (const [k, v] of usage.entries())
    usage.set(k, v / total_usage_count)

  return { evaluate, usage }
}
