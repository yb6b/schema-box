import { CollisionCounter } from '../simulator/collision-counter'
import { comboFeelData } from '../feeling-data'
import type { FreqMatrix, HanziMap } from './share'
import { calcEq, getTotalUsage, hanziMapFromMb, keys46Set, parseFreqTsv } from './share'
import type { EvaluateBaseItem } from './hanzi'
import { freqToRelativeFreq } from '@/libs/utils'
import type { Mabiao } from '@/libs/schema'

/** 默认的词频表 */
export const presetWordsFreq = (await import('./words-freq')).default

/** 测评一个码表的组词性能 */
export function quickEvaluateWords(mb: Mabiao) {
  // 获取词频数据
  const freqTsv = parseFreqTsv(presetWordsFreq).slice(0, 60000)
  const all_zi = new Set<string>()
  for (const e of freqTsv) {
    for (const a of e[0])
      all_zi.add(a)
  }
  // TODO: 要留意词频的格式 数量 词语字数
  // 获取单字码表
  const hanzi_map = hanziMapFromMb(mb, all_zi, false)
  // 测评词库
  const evaluateResult = evaluateSections(freqTsv, hanzi_map)
  return { evaluateResult, usage: freqToRelativeFreq(getTotalUsage(evaluateResult)) }
}

/** 非缺字的词条的信息 */
export interface EvaluateWordsItem extends EvaluateBaseItem {
  /** 编码 */
  code: string
  /** 编码长度 */
  cdLen: number
  /** 选重数 */
  collision: number
  /** 词编码的加权当量, 已经乘了词频, 最后使用时求和再除以总频数 */
  eq: number
  /** 本词条编码里左右互击的次数 */
  dh: number
  /** 本词条编码里同指大跨排的次数 */
  ms: number
  /** 本词条编码里同指小跨排的次数 */
  ss: number
  /** 本词条编码里小指干扰的次数 */
  pd: number
  /** 本词条编码里错手的次数 */
  lfd: number
  /** 本词条编码里三连击的次数 */
  trible: number
  /** 本词条编码里超标键位的次数 */
  overKey: number
}

/** 每一行的测评结果 */
export interface EvaluateLineWords {
  /** 每一条词语的数据, 使用时注意过滤缺字和超标 */
  items: Array< EvaluateWordsItem | EvaluateBaseItem>
  /** 总频数 */
  freq: number
  /** 从第几个字频开始 */
  start: number
  /** 到第几个字频结束(不包括) */
  end: number
  /** 按键使用量, 已经加权过了 */
  usage: Record<string, number>
}

/** 测评6个区间 */
function evaluateSections(matrix: FreqMatrix, hanzimap: HanziMap) {
  const WordsSections = [[0, 2000], [2000, 5000], [5000, 10000], [10000, 20000], [20000, 40000], [40000, 60000]] as const
  const collisionCounter = new CollisionCounter()

  const result: EvaluateLineWords[] = []
  for (const [a, b] of WordsSections) {
    const sectionRs: EvaluateLineWords = { freq: 0, items: [], usage: {}, start: a, end: b }
    for (let i = a; i < b; i++) {
      const el = matrix[i]
      if (el.length !== 2)
        throw new Error(`词频数据格式错误：第${i + 1}行不是两列`)
      const [wd, freq] = el
      sectionRs.freq += freq

      const cd = makeCodeUnderWubi(hanzimap, wd)
      // 缺字
      if (!cd) {
        sectionRs.items.push({ wd, freq, reFreq: 0, freqRank: i + 1 })
        continue
      }
      const cdLen = cd.length
      const tmpEvaluateItem: EvaluateWordsItem = {
        wd,
        freq,
        reFreq: 0,
        freqRank: i + 1,
        collision: collisionCounter.add(cd),
        code: cd,
        cdLen,
        eq: 0,
        dh: 0,
        ms: 0,
        ss: 0,
        pd: 0,
        lfd: 0,
        trible: 0,
        overKey: 0,
      }

      // 超标键位
      for (const k of cd) {
        if (!keys46Set.has(k)) {
          tmpEvaluateItem.overKey += 1
        }
        else {
          // 各按键使用率 写在区间的数据上
          const oldKeyUsage = sectionRs.usage[k]
          sectionRs.usage[k] = oldKeyUsage ? oldKeyUsage + freq : freq
        }
      }
      if (tmpEvaluateItem.overKey > 0) {
        sectionRs.items.push(tmpEvaluateItem)
        continue
      }

      // 互击 大跨排 小跨排 小指干扰 错手
      const comboKeys = ['dh', 'ms', 'ss', 'pd', 'lfd'] as const
      for (const e of comboKeys) {
        for (let i = 1; i < cdLen; i++) {
          const combo = cd[i - 1] + cd[i]
          if (comboFeelData[combo]![e])
            tmpEvaluateItem[e] += 1
        }
      }

      // 三连击
      for (let i = 2; i < cdLen; i++) {
        if (cd[i - 2] === cd[i - 1] && cd[i - 1] === cd[i])
          tmpEvaluateItem.trible += 1
      }

      // 加权当量
      const wdEq = cdLen < 2 ? 1 : calcEq(cd)
      tmpEvaluateItem.eq += wdEq * freq

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

/** 五笔规则造词, 生成编码, 如果无法造词, 返回空字符串 */
function makeCodeUnderWubi(hanzimap: HanziMap, words: string): string {
  const wordsArray = [...words]
  // 2 字词
  if (wordsArray.length === 2) {
    const cd1 = hanzimap.get(wordsArray[0])
    if (!cd1)
      return ''
    const cd2 = hanzimap.get(wordsArray[1])
    if (!cd2)
      return ''
    return (cd1.item[1].slice(0, 2)
      + cd2.item[1].slice(0, 2))
  }
  // 3 字词
  if (wordsArray.length === 3) {
    const cd1 = hanzimap.get(wordsArray[0])
    if (!cd1)
      return ''
    const cd2 = hanzimap.get(wordsArray[1])
    if (!cd2)
      return ''
    const cd3 = hanzimap.get(wordsArray[2])
    if (!cd3)
      return ''
    return (cd1.item[1].slice(0, 2)
      + cd2.item[1][0]
      + cd3.item[1][0])
  }
  // 多字词
  const cd1 = hanzimap.get(wordsArray[0])
  if (!cd1)
    return ''
  const cd2 = hanzimap.get(wordsArray[1])
  if (!cd2)
    return ''
  const cd3 = hanzimap.get(wordsArray[2])
  if (!cd3)
    return ''
  const cd4 = hanzimap.get(wordsArray[wordsArray.length - 1])
  if (!cd4)
    return ''
  return (cd1.item[1][0]
    + cd2.item[1][0]
    + cd3.item[1][0]
    + cd4.item[1][0])
}
