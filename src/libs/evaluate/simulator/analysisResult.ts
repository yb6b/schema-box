import { comboFeelData, keyFeelData } from '../feelData'
import type { Segment } from './segmentation'

type Dist = number[]

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
    this.codeLengthDist = Array(maxCodeLength).fill(0)
    for (const k in keyFeelData)
      this.keysDist[k] = 0
  }

  /** 所有按键组合的为了性能，一开始只把键位组合统计到map里 */
  private comboDist: Map<string, number> = new Map()

  /** 选重按键, 如果选重超出了,会翻页 */
  collisionKeys = ' 23456789'
  /** 上屏码长 */
  commitLength = 4

  /** 方案里缺少的字符, 无法打出的字符 */
  lackCounter = new Map<string, number>()
  /** 缺字的总数, 文章里每次出现都要累加（由lackCounter计算出） */
  lack = 0
  /** 上屏的字符总数（÷ 次数） */
  hanzi = 0
  /** 上屏总次数 */
  commit = 0
  /** 打词的次数（÷ 总上屏）(由wordsDist统计出) */
  words = 0
  /** 打词的总字数（÷ 总字数）（由wordsDist统计出） */
  wordsChar = 0
  /**
   * 各长度的词语的次数,
   * 例：索引0表示上屏单字的次数
   *
   * 需要提供最大值,用于性能优化
   */
  wordsDist: Dist
  /** 选重次数, 非首选（÷ 总上屏） */
  collision = 0
  /** 选重字数（÷ 总字数） */
  collisionChar = 0
  /**
   * 选重频数分布
   *
   * 需要提供最大值,用于性能优化
   */
  collisionDist: Dist
  /** 上屏的编码总长 （÷ 总上屏）(由codeLengthDist计算得到) */
  codeLength = 0
  /**
   * 不同编码长度的分布,例：索引0表示1码长的上屏次数
   *
   * 需要提供最大值,用于性能优化
   */
  codeLengthDist: Dist
  /** 各按键的频数 */
  keysDist: Record<string, number> = {}
  /** 总击键数（从keysDist计算出） */
  keys = 0
  /** 各手指的使用次数（从keysDist计算出） */
  fingersDist: Dist = Array(11).fill(0)
  /** 键盘每一行的使用次数（从keysDist计算出） */
  kbdRowDist: Dist = [0, 0, 0, 0]
  /** 按键组合总数 */
  combo = 0
  /** 总当量 */
  Eq = 0
  /** 三连击频数（÷ combo-1） */
  trible = 0
  /** 二连击频数（÷ combo） */
  double = 0
  /** 小跨排频数（÷ combo） */
  singleSpan = 0
  /** 大跨排频数（÷ combo） */
  multiSpan = 0
  /** 错手频数（÷ combo） */
  longFD = 0
  /** 小指干扰频数（÷ combo） */
  littleFD = 0
  /** 同指组合（÷ combo） */
  sameFingers = 0
  /** 先左手再右手的组合数量（÷ combo） */
  LeftRight = 0
  /** 先左手再左手的组合数量（÷ combo） */
  LeftLeft = 0
  /** 先右手再右手的组合数量（÷ combo） */
  RightRight = 0
  /** 先右手再左手的组合数量（÷ combo） */
  RightLeft = 0
  /** 用于性能优化，左右手对。 */
  private _hp = [0, 0, 0, 0]
  /** 默认的当量数据是乘10的 */
  private _Eq10 = 0
  /** these codes  */
  private _t = ''
  /** last code */
  private _l = ''
  /** code before last 用于统计三连击 */
  private _l2 = ''

  /**
   * reform 修正结果
   */
  reform() {
    // 补全当量
    this.Eq = this._Eq10 / 10

    for (const key in keyFeelData) {
      const magic = keyFeelData[key]
      const count = this.keysDist[key]
      // 补全总按键数
      this.keys += count
      // 补全手指使用频率
      const finger = magic >> 2
      this.fingersDist[finger] += count
      // 补全键盘排号
      const row = magic & 0x3
      this.kbdRowDist[row] += count
    }

    // 补齐双手组合
    this.RightRight = this._hp[3]
    this.RightLeft = this._hp[2]
    this.LeftRight = this._hp[1]
    this.LeftLeft = this._hp[0]

    // 缺字
    for (const i of this.lackCounter.values())
      this.lack += i

    // 打词
    for (let i = 1; i < this.wordsDist.length; i++) {
      this.words++
      this.wordsChar += this.wordsDist[i] * (i + 1)
    }

    // 码长
    this.codeLengthDist.forEach((v, i) => {
      this.codeLength += v * (i + 1)
    })
  }

  /**
   * 添加分词结果, 初步分析。
   */
  add(aSegValue: Segment) {
    this.handle(aSegValue)
    this.upc()
  }

  private handle(value: Segment) {
    switch (value.type) {
      case 1:{
        this.hTT(value)
        // 只有字典里的词条才计算组合手感
        this.hCombo()
        break
      }
      case 5:{
        this.hLack(value)
        // 缺字情况下，没有编码
        return
      }
    }
    this.hKeys()
  }

  /** 处理缺字 */
  private hLack(value: Segment) {
    const w = this.lackCounter.get(value.bw!)
    this.lackCounter.set(value.bw!, w ? w + 1 : 1)
  }

  /** 处理字典树匹配到的情况 */
  private hTT(value: Segment) {
    let code = value.ttv!.i![1]
    const collision = value.ttv!.c
    // 码长不能加选重键
    this.codeLengthDist[code.length - 1]++
    // 要加选重键的情况
    if (code.length < this.commitLength || collision !== 1)
      code += this.collisionKeys[collision - 1]
    this._t = code
    const wordsLen = [...value.ttv!.i![0]].length
    this.hanzi += wordsLen
    this.commit++
    this.wordsDist[wordsLen - 1]++
    this.collisionChar += wordsLen
    this.collisionDist[collision - 1]++
  }

  /** 处理按键 */
  private hKeys() {
    this.keys += this._t.length
    for (const i of this._t)
      this.keysDist[i]++
  }

  /** 分析按键组合 */
  private hCombo() {
    // 两键组合
    const expandCode = this._l + this._t
    for (let i = 1; i < expandCode.length; i++) {
      this.combo++
      const comb = expandCode[i - 1] + expandCode[i]
      const feelMagic = comboFeelData[comb]

      this._Eq10 += feelMagic & 0x1F

      this.double += (feelMagic >> 6) & 1
      this.littleFD += (feelMagic >> 7) & 1
      this.singleSpan += (feelMagic >> 8) & 1
      this.longFD += (feelMagic >> 9) & 1
      this.multiSpan += (feelMagic >> 10) & 1

      const firstFinger = keyFeelData[expandCode[i - 1]]
      const secondFinger = keyFeelData[expandCode[i]]
      this.sameFingers += (firstFinger === secondFinger) as unknown as number

      const isFirstHandRight = (firstFinger > 5) as unknown as number
      const isSecondHandRight = (secondFinger > 5) as unknown as number
      this._hp[isFirstHandRight << 1 | isSecondHandRight]++
    }
    // 三连击
    const expandCode2 = this._l2 + expandCode
    for (let i = 2; i < expandCode2.length; i++) {
      const a = (expandCode2[i - 2] === expandCode2[i - 1]) as unknown as number
      const b = (expandCode2[i - 1] === expandCode2[i]) as unknown as number
      this.trible += a & b
    }
  }

  /** 更新编码, 当前编码、前一个按键、前2个按键 */
  private upc() {
    const t = this._t
    switch (t.length) {
      case 0:break
      case 1:
        this._l2 = this._l
        this._l = t
        break
      default:
        this._l2 = t[t.length - 2]
        this._l = t[t.length - 1]
        break
    }
  }
}
