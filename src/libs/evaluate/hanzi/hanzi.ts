/** 根据字频表数据测评, 即科学形码测评系统 */

import { comboFeelData } from '../feeling-data'
import { fingerLoad } from '../feeling-data/finger-load'
import type { FreqMatrix, HanziMap } from './share'
import { calcEq, getTotalUsage, hanziMapFromMb, keys46Set, parseFreqTsv } from './share'
import { freqToRelativeFreq, intersectionBetweenSets, objectKeysToSet, pickObject } from '@/libs/utils'
import type { Mabiao } from '@/libs/schema'
import { getKeysSet } from '@/libs/schema'

export const presetHanziFreq = (await import('./hanzi-freq')).default

export function quickEvaluateHanzi(mb: Mabiao, tsv?: string) {
  const freq_tsv = parseFreqTsv(tsv ?? presetHanziFreq).slice(0, 6000)
  const hanzi_map = hanziMapFromMb(mb, freq_tsv.map(v => v[0]))
  const evaluate_result = evaluateSections(freq_tsv, hanzi_map, mb)

  return {
    evaluate: evaluate_result,
    baseFinLoadRate: getBaseFinLoadRate(mb),
    usage: freqToRelativeFreq(getTotalUsage(evaluate_result)),
  }
}

export interface EvaluateBaseItem {
  /** 字词 */
  wd: string
  /** 频数 */
  freq: number
  /** 全局频率 */
  reFreq: number
  /** 字频排名 */
  freqRank: number
}

/** 非缺字的汉字信息, 也是详细表格里会展示的列 */
export interface EvaluateHanziItem extends EvaluateBaseItem {
  /** 编码 */
  code: string
  /** 原码表里的行数 */
  line: number
  /** 选重数 */
  collision: number
  /** 选重键, 空字符串表示可以直接上屏 */
  selectKey: string
  /** 码长, 用于统计一码 两码…… */
  cdLen: number
  /** 理论二简 */
  brief2: boolean
  /** 加权键长, 使用时要除以总频数 */
  CL: number
  /** 加权字均当量, 使用时汇总再除以总频数 */
  ziEq: number
  /** 加权键均当量, 使用时汇总再除以总频数 */
  keyEq: number
  /** 左右互击的次数 */
  dh: number
  /** 同指大跨排的次数 */
  ms: number
  /** 同指小跨排的次数 */
  ss: number
  /** 小指干扰的次数 */
  pd: number
  /** 错手的次数 */
  lfd: number
  /** 三连击的次数 */
  trible: number
  /** 超标键位的次数 */
  overKey: number
}

/** 每一行的测评结果 */
export interface EvaluateLineHanzi {
  /** 每一条数据 */
  items: Array< EvaluateHanziItem | EvaluateBaseItem>
  /** 从第几个字频开始 */
  start: number
  /** 到第几个字频结束(不包括) */
  end: number
  /** 这一行的总频数 */
  freq: number
  /** 按键使用量, 已经加权过了, 也要用于计算用指负荷 */
  usage: Record<string, number>
}

/** 测评5个区间 */
export function evaluateSections(matrix: FreqMatrix, hanzimap: HanziMap, mb: Mabiao) {
  const sections = [[0, 300], [300, 500], [500, 1500], [1500, 3000], [3000, 6000]] as const
  const result: EvaluateLineHanzi[] = []

  /** 用于计算理论二简 */
  const brief2Set = new Set<string>()

  for (const [a, b] of sections) {
    const sectionRs: EvaluateLineHanzi = {
      items: [],
      start: a,
      end: b,
      freq: 0,
      usage: {},
    }
    for (let i = a; i < b; i++) {
      const el = matrix[i]
      if (el.length !== 2)
        throw new Error(`字频数据格式错误：第${i + 1}行不是两列`)

      const [wd, freq] = el
      sectionRs.freq += freq // 是不是这个位置？

      const hanzimap_rs = hanzimap.get(wd)
      // 缺字
      if (!hanzimap_rs) {
        sectionRs.items.push({ wd, freq, reFreq: 0, freqRank: i + 1 })
        continue
      }
      const cd = hanzimap_rs.item[1]
      const cdLen = cd.length
      const collision = hanzimap_rs.collision

      // 补齐选重键
      let selectKey = ''
      const selectKeyLen = mb.selectKeys!.length
      if (mb.cmLen! > cdLen || collision > 1) {
        const coll = collision > selectKeyLen ? selectKeyLen : collision
        selectKey = mb.selectKeys![coll - 1]
      }

      // 手指使用量
      for (const k of cd) {
        const oldUsage = sectionRs.usage[k] ?? 0
        sectionRs.usage[k] = oldUsage + freq
      }
      if (selectKey) {
        const oldUsage = sectionRs.usage[selectKey] ?? 0
        sectionRs.usage[selectKey] = oldUsage + freq
      }

      /** 待测评的词条 */
      const tmpEvaluateItem: EvaluateHanziItem = {
        wd,
        freq,
        reFreq: 0,
        freqRank: i + 1,
        code: cd,
        line: hanzimap_rs.item[2],
        collision,
        selectKey,
        cdLen,
        brief2: false, //
        CL: 0, //
        ziEq: 0, //
        keyEq: 0, //
        dh: 0, //
        ms: 0, //
        ss: 0, //
        pd: 0, //
        lfd: 0, //
        trible: 0, //
        overKey: 0, //
      }

      // 过滤超标键位
      for (const k of cd) {
        if (!keys46Set.has(k))
          tmpEvaluateItem.overKey += 1
      }
      if (tmpEvaluateItem.overKey > 0) {
        sectionRs.items.push(tmpEvaluateItem)
        continue
      }

      // 理论二简
      const code2 = cd.slice(0, 2)
      if (!brief2Set.has(code2)) {
        brief2Set.add(code2)
        tmpEvaluateItem.brief2 = true
      }

      // 互击 大跨排 小跨排 小指干扰 错手
      const comboKeys = ['dh', 'ms', 'ss', 'pd', 'lfd'] as const
      for (const e of comboKeys) {
        for (let i = 1; i < cd.length; i++) {
          const combo = cd[i - 1] + cd[i]
          if (comboFeelData[combo][e])
            tmpEvaluateItem[e] += 1
        }
      }

      // 三连击
      for (let i = 2; i < cdLen; i++) {
        if (cd[i - 2] === cd[i - 1] && cd[i - 1] === cd[i])
          tmpEvaluateItem.trible += 1
      }

      const cdWithSelect = cd + selectKey
      const keysLen = cdWithSelect.length

      // 字均当量
      // 1 码字的当量为 1
      const ziEq = keysLen < 2 ? 1 : calcEq(cdWithSelect)

      tmpEvaluateItem.ziEq = ziEq * freq
      // 键均当量
      tmpEvaluateItem.keyEq = (ziEq / (keysLen - 1)) * freq

      // 加权键长
      tmpEvaluateItem.CL = keysLen * freq

      sectionRs.items.push(tmpEvaluateItem)
    }
    result.push(sectionRs)
  }

  // 补齐相对词频数据
  let totalFreq = 0
  for (const e of result)
    totalFreq += e.freq
  for (const e of result) {
    for (const it of e.items)
      it.reFreq = it.freq / totalFreq
  }
  return result
}

function getBaseFinLoadRate(mb: Mabiao) {
  const keysInFingerLoad = intersectionBetweenSets(
    getKeysSet(mb),
    objectKeysToSet(fingerLoad),
  )
  const customFingerLoad = pickObject(fingerLoad, keysInFingerLoad)
  const baseFinLoadRate = freqToRelativeFreq(customFingerLoad)
  return baseFinLoadRate
}
