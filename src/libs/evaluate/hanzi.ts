/**
 * 根据字频表数据测评, 即科学形码测评系统
 */

import { parseTsv } from 'libs/utils'
import type { Mabiao, MabiaoItem } from '../schema'
import { comboFeelData } from './feelData'
import { KEYS } from './feelData/combo'

const keys30Set = new Set('abcdefghijklmnopqrstuvwxyz;,./')
export const presetHanziFreq = (await import('./hanziFreq')).default

/** 获取字频数据 */
type FreqMatrix = [string, number][]
export function parseHanziFreq(tsv: string): FreqMatrix {
  const matrix = parseTsv(tsv)
  if (matrix.length < 6000)
    throw new Error('字频数据少于6000行')
  return matrix.map(v => [v[0], Number.parseInt(v[1])])
}

interface PurifiedMbItemA {
  wd: string
  freq: number
  code: string
  line: number
}

interface PurifiedMbItemLack {
  wd: string
  freq: number
}

type PurifiedMbItem = PurifiedMbItemLack | PurifiedMbItemA

/**
 * 提取码表中的单字码表
 * TODO 需要更复杂地处理重码
 */
export function purifyMabiao(mb: Mabiao, freqM: FreqMatrix, shortCode = true): PurifiedMbItem[] {
  const hanziSet = new Set(freqM.map(v => v[0]))
  const hanziMap = new Map<string, MabiaoItem>()
  for (const e of mb.items) {
    const wd = e[0]
    // 过滤非6k个汉字
    if (wd.length > 1 || !hanziSet.has(wd))
      continue
    const oldItem = hanziMap.get(wd)
    // 没有数据时, 添加数据
    if (!oldItem) {
      hanziMap.set(wd, e)
      continue
    }
    // 有数据时, 单字测评取码长更短的
    if (shortCode) {
      if (oldItem[1].length > e[1].length)
        hanziMap.set(wd, e)
    }
    // 词语测评取码长更长的
    else {
      if (oldItem[1].length < e[1].length)
        hanziMap.set(wd, e)
    }
  }
  const rs = []
  for (const [wd, freq] of freqM) {
    if (hanziMap.has(wd)) {
      const item = hanziMap.get(wd)!
      rs.push({
        wd,
        freq,
        code: item[1],
        line: item[2],
      })
    }
    else {
      rs.push({
        wd,
        freq,
      })
    }
  }
  return rs
}

export interface EvaluateItems {
  /** 总频数 */
  freq: number
  /** 1码 */
  L1: PurifiedMbItem[]
  /** 2码 */
  L2: PurifiedMbItem[]
  /** 3码 */
  L3: PurifiedMbItem[]
  /** 4码 */
  L4: PurifiedMbItem[]
  /** 选重 */
  collision: PurifiedMbItem[]
  /** 理论二简 */
  brief2: PurifiedMbItem[]
  /** 加权键长, 使用时要除以总频数 */
  CL: number
  /** 加权字均当量, 使用时要除以总频数 */
  ziEq: number
  /** 加权键均当量, 使用时要除以总频数 */
  keyEq: number
  /** 左右互击 */
  dh: PurifiedMbItem[]
  /** 同指大跨排 */
  ms: PurifiedMbItem[]
  /** 同指小跨排 */
  ss: PurifiedMbItem[]
  /** 小指干扰 */
  pd: PurifiedMbItem[]
  /** 错手 */
  lfd: PurifiedMbItem[]
  /** 三连击 */
  trible: PurifiedMbItem[]
  /** 超标键位 */
  overKey: PurifiedMbItem[]
  /** 缺字 */
  lack: PurifiedMbItem[]
}

function createEmptyEvaluateItems(): EvaluateItems {
  return {
    freq: 0,
    L1: [],
    L2: [],
    L3: [],
    L4: [],
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
/** 测评5个区间 */
export function evaluateSections(purifiedMb: PurifiedMbItem[]) {
  const sections = [[0, 300], [300, 500], [500, 1500], [1500, 3000], [3000, 6000]]
  const rs: EvaluateItems[] = []
  const brief2Set = new Set<string>()
  for (const [a, b] of sections) {
    const sectionRs = createEmptyEvaluateItems()
    for (let i = a; i < b; i++) {
      const el = purifiedMb[i]
      sectionRs.freq += el.freq
      // 缺字
      if (!('code' in el)) {
        sectionRs.lack.push(el)
        continue
      }
      const cd = el.code
      const cdLen = cd.length

      // 超标
      let hasOverKey = false
      for (const e of cd) {
        if (!keys30Set.has(e)) {
          sectionRs.overKey.push(el)
          hasOverKey = true
          break
        }
      }
      if (hasOverKey)
        continue

      // 1码 2码 3码 4码 选重
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
          sectionRs.collision.push(el)
          break
      }

      // 理论二简
      const code2 = cd.slice(0, 2)
      if (!brief2Set.has(code2)) {
        brief2Set.add(code2)
        sectionRs.brief2.push(el)
      }

      // 互击 大跨排 小跨排 小指干扰 错手
      const comboKeys: ReadonlyArray<keyof typeof comboFeelData['']> = ['dh', 'ms', 'ss', 'pd', 'lfd']
      for (const e of comboKeys)
        pushCombo(sectionRs, e, el)

      // 三连击
      for (let i = 2; i < cdLen; i++) {
        if (cd[i - 2] === cd[i - 1] && cd[i - 1] === cd[i])
          sectionRs.trible.push(el)
      }
      const freq = el.freq
      if (cdLen < 2) {
        sectionRs.ziEq += freq
        sectionRs.keyEq += freq
      }
      else {
        const eq = calcEq(cd)
        sectionRs.ziEq += eq * freq
        sectionRs.keyEq += (eq / (cdLen - 1)) * freq
      }
      sectionRs.CL += cdLen * freq
    }
    rs.push(sectionRs)
  }
  return rs
}

export function quickEvaluate(mb: Mabiao) {
  return evaluateSections(purifyMabiao(mb, parseHanziFreq(presetHanziFreq)))
}

function pushCombo(rs: EvaluateItems, item: keyof typeof comboFeelData[''], el: PurifiedMbItemA) {
  const cd = el.code
  for (let i = 1; i < cd.length; i++) {
    const combo = cd[i - 1] + cd[i]
    if (comboFeelData[combo]?.[item]) {
    // @ts-expect-error items here match dh ms ss pd lfd
      rs[item].push(el)
      break
    }
  }
}

/** 调用前, 处理码长1的情况 */
function calcEq(cd: string) {
  let rs = 0
  for (let i = 1; i < cd.length; i++) {
    const combo = cd[i - 1] + cd[i]
    rs += comboFeelData[combo].eq
  }
  return rs
}

/** 测评2个合计 */
export function zipEvaluationItems(items: EvaluateItems[]) {
  const rs = createEmptyEvaluateItems()
  const arrKeys = ['L1', 'L2', 'L3', 'L4', 'collision', 'brief2', 'dh', 'ms', 'ss', 'pd', 'lfd', 'trible', 'overKey', 'lack'] as const
  const numberKeys = ['freq', 'CL', 'ziEq', 'keyEq'] as const
  for (const item of items) {
    for (const k of arrKeys)
      rs[k] = rs[k].concat(item[k])
    for (const k of numberKeys)
      rs[k] += item[k]
  }
  return rs
}

/** 测评2个加权行 传入合计过的 */
export function calcWeightedEvalItems(item: EvaluateItems) {
  const rs: any = {}
  const arrKeys = ['L1', 'L2', 'L3', 'L4', 'collision', 'brief2', 'dh', 'ms', 'ss', 'pd', 'lfd', 'trible', 'overKey', 'lack'] as const
  const totalFreq = item.freq
  for (const k of arrKeys) {
    let f = 0
    for (const e of item[k])
      f += e.freq / totalFreq
    rs[k] = f
  }
  return rs
}
