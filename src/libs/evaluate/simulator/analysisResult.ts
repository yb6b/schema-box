import { comboFeelData, keyFeelData } from '../feelData'
import type { Segment } from './segmentation'

type Dist = number[]

export type FullAnalysisResult = ReturnType<AnalysisResult['reform']>
/**
 * 赛码器运行结束后的结果
 */
export class AnalysisResult {
  /**
   * 为了性能,需要提供几个最大值用于初始化,
   *
   * 新建完成后,请检查 collisionKeys 和 commitLength 参数
   */
  constructor(maxCollision: number, maxWords: number, maxCodeLength: number) {
    this.collisionDist = Array(maxCollision).fill(0)
    this.wordsDist = Array(maxWords).fill(0)
    this.codeLenDist = Array(maxCodeLength).fill(0)
    for (const k in keyFeelData)
      this.keysDist[k] = 0
    for (const k in comboFeelData)
      this.comboDist[k] = 0
  }

  reform() {
    const lackCounter = this.lackCounter
    let lacks = 0
    for (const e of lackCounter.values())
      lacks += e
    const lackString = [...lackCounter.keys()].sort().join('')

    const wordsDist = dropLastFalsyItems(this.wordsDist)
    const singleCount = wordsDist[0]
    let commit = 0
    let char = 0
    for (let i = 0; i < wordsDist.length; i++) {
      const n = wordsDist[i]
      commit += n
      char += n * (i + 1)
    }

    const collisionDist = dropLastFalsyItems(this.collisionDist)
    let collision = 0
    for (const e of collisionDist)
      collision += e

    const codeLenDist = dropLastFalsyItems(this.codeLenDist)
    let codeLen = 0
    for (let i = 0; i < codeLenDist.length; i++) {
      const e = codeLenDist[i]
      codeLen += e * (i + 1)
    }

    const keysDist = dropNanInRecord(this.keysDist)
    const kbdRowDist: Dist = [0, 0, 0, 0]
    const finDist: Dist = Array(11).fill(0)
    let keys = 0
    for (const [k, n] of Object.entries(keysDist)) {
      keys += n
      const row = keyFeelData[k].row
      kbdRowDist[row] += n
      const fin = keyFeelData[k].fin
      finDist[fin] += n
    }

    const comboDist = dropNanInRecord(this.comboDist)
    let combo = 0
    let Eq = 0
    let double = 0
    let singleSpan = 0
    let multiSpan = 0
    let longFD = 0
    let littleFD = 0
    let sameFingers = 0
    let leftLeft = 0
    let leftRight = 0
    let rightRight = 0
    let rightLeft = 0
    // TODO 处理大写字母
    for (const [k, n] of Object.entries(comboDist)) {
      combo += n
      const feeldata = comboFeelData[k]
      if (!feeldata)
        continue
      Eq += feeldata.eq * n
      double += (feeldata.dc as unknown as number) * n
      singleSpan += (feeldata.ss as unknown as number) * n
      multiSpan += (feeldata.ms as unknown as number) * n
      longFD += (feeldata.lfd as unknown as number) * n
      littleFD += (feeldata.pd as unknown as number) * n
      const fin1 = keyFeelData[k[0]].fin
      const fin2 = keyFeelData[k[1]].fin
      sameFingers += (fin1 === fin2) as unknown as number * n
      const right1 = fin1 > 5
      const right2 = fin2 > 5
      leftLeft += (!right1 && !right2) as unknown as number * n
      leftRight += (!right1 && right2) as unknown as number * n
      rightRight += (right1 && right2) as unknown as number * n
      rightLeft += (right1 && right2) as unknown as number * n
    }
    Eq = (Eq * 10 | 0) / 10
    const diffHand = leftRight + rightLeft

    return {
      lacks,
      lackString,
      lackCounter,
      wordsDist,
      singleCount,
      commit,
      char,
      collision,
      collisionDist,
      codeLen,
      codeLenDist,
      keys,
      keysDist,
      kbdRowDist,
      finDist,
      comboDist,
      combo,
      Eq,
      double,
      singleSpan,
      multiSpan,
      longFD,
      littleFD,
      sameFingers,
      leftLeft,
      leftRight,
      rightRight,
      rightLeft,
      diffHand,
    } as const
  }

  /** 选重按键, 如果选重超出了,会翻页 */
  collisionKeys = ' 23456789'
  /** 上屏码长 */
  commitLength = 4

  /** 所有按键组合的为了性能，一开始只把键位组合统计到map里 */
  private comboDist: Record<string, number> = {}
  /** 方案里缺少的字符, 无法打出的字符 */
  private lackCounter = new Map<string, number>()

  /**
   * 各长度的词语的次数,
   * 例：索引0表示上屏单字的次数
   *
   * 需要提供最大值,用于性能优化
   */
  private wordsDist: Dist

  /**
   * 选重频数分布
   *
   * 需要提供最大值,用于性能优化
   *
   * - 索引 0 顶字上屏
   * - 索引 1 首选
   * - 索引 2 二重
   */
  private collisionDist: Dist

  /**
   * 不同编码长度的分布,例：索引0表示1码长的上屏次数
   *
   * 需要提供最大值,用于性能优化
   */
  private codeLenDist: Dist

  /** 各按键的频数 */
  private keysDist: Record<string, number> = {}

  /** these codes  */
  private _t = ''
  /** last code */
  private _l = ''

  /**
   * 添加分词结果, 初步分析。
   */
  add(aSegValue: Segment) {
    this.handle(aSegValue)
    this._l = this._t[this._t.length - 1]
  }

  private handle(value: Segment) {
    switch (value.type) {
      // 词条
      case 1:{
        this.hTT(value)
        // 只有字典里的词条才计算组合手感
        this.hCombo()
        break
      }
      // 缺字
      case 5:{
        this.hLack(value)
        // 缺字情况下，没有编码
        return
      }
    }
    // 标点和英文
    this.hKeys()
  }

  /** 处理缺字 */
  private hLack(value: Segment) {
    const w = this.lackCounter.get(value.bw!)
    this.lackCounter.set(value.bw!, w ? w + 1 : 1)
    this._l = ''
    this._t = ''
  }

  /** 处理字典树匹配到的情况 */
  private hTT(value: Segment) {
    let code = value.ttv!.i![1]

    const collision = value.ttv!.c
    this.collisionDist[collision - 1]++

    const wordsLen = [...value.ttv!.i![0]].length
    this.wordsDist[wordsLen - 1]++

    // 码长不考虑选重键
    this.codeLenDist[code.length - 1]++

    // 要加选重键的情况
    if (code.length < this.commitLength || collision !== 1)
      code += this.collisionKeys[collision - 1]
    this._t = code
  }

  /** 处理按键 */
  private hKeys() {
    for (const i of this._t)
      this.keysDist[i]++
  }

  /** 分析按键组合 */
  private hCombo() {
    // 两键组合
    const expandCode = this._l + this._t
    for (let i = 1; i < expandCode.length; i++) {
      const comb = expandCode[i - 1] + expandCode[i]
      this.comboDist[comb]++
    }
  }
}

function dropLastFalsyItems(d: Dist) {
  let lastIndex = 0
  for (let i = d.length - 1; i >= 0; i--) {
    if (d[i]) {
      lastIndex = i + 1
      break
    }
  }
  return d.slice(0, lastIndex)
}

function dropNanInRecord(d: Record<string, number>) {
  return Object.fromEntries(Object.entries(d).filter(([_, n]) => !!n))
}
