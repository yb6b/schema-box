/**
 * @file 分析分词的结果
 * @author yb6b
 */
import type { SegValue } from './segmentation'

const feel = await import('./feelData')

export interface RacerResult {
  hanzi: number // 上屏的汉字总数
  lack: number // 缺字
  lackSet: Set<string>
  commit: number // 上屏总数

  words: number // 打词的次数，rate:总上屏
  wordsChar: number // 打词的总字数，rate:总字数
  wordsDist: number[] // 不同字数的词的频数

  collision: number // 选重的次数，rate:总上屏
  collisionChar: number // 选重的总字数，rate:总字数
  collisionDist: number[] // 不同选重的词的频数

  CL: number // 上屏汉字的编码总长，rate:总上屏
  CLDist: number[] // 不同编码长度的频数

  keys: number // 总击键数
  keysDist: {
    [keyName: string]: number
  } // 不同按键的频数

  fingers: number[] // 各手指（按Fingers enum索引）的使用频率

  comb: number // 按键组合总数
  Eq: number // 总当量，注意除10
  trible: number // 三连击频数
  double: number// 二连击频数
  singleSpan: number // 小跨排频数
  multiSpan: number // 大跨排频数
  longFingerDisturb: number // 错手频数
  littleFingerDisturb: number // 小指干扰频数

  sameFingers: number // 同指组合

  LL: number// 左手到左手
  LR: number// 左手到右手
  RR: number// 右手到右手
  RL: number// 右手到左手
}

/**
 * 生成空的赛码器结果对象
 * @returns 空的赛码器结果
 */
export function createEmptyRacerResult(): RacerResult {
  return {
    hanzi: 0, // 上屏的汉字总数
    lack: 0, // 缺字
    lackSet: new Set(),
    commit: 0, // 上屏总数

    words: 0, // 打词的次数，rate:总上屏
    wordsChar: 0, // 打词的总字数，rate:总字数
    wordsDist: [], // 不同字数的词的频数

    collision: 0, // 选重的次数，rate:总上屏
    collisionChar: 0, // 选重的总字数，rate:总字数
    collisionDist: [], // 不同选重的词的频数

    CL: 0, // 上屏编码总长，rate:总上屏
    CLDist: [], // 不同编码长度的频数

    keys: 0, // 总击键数
    keysDist: {}, // 不同按键的频数

    comb: 0, // 按键组合总数
    Eq: 0, // 总当量，注意除10
    trible: 0, // 三连击频数
    double: 0, // 二连击频数
    singleSpan: 0, // 小跨排频数
    multiSpan: 0, // 大跨排频数
    longFingerDisturb: 0, // 错手
    littleFingerDisturb: 0, // 小指干扰

    sameFingers: 0, // 同指组合
    fingers: Array(9).fill(0),

    LL: 0, // 左手到左手
    LR: 0, // 左手到右手
    RR: 0, // 右手到右手
    RL: 0, // 右手到左手
  }
}

/**
 * 在数字数组中，自动递增一个元素，如果位置过大，会自动扩容
 * @param arr 要添加的数组
 * @param index 修改位置的索引号
 */
function autoIncreaseArrayElement(arr: number[], index: number) {
  if (index >= arr.length) {
    for (let i = index - arr.length; i > 0; i--)
      arr.push(0)
    arr.push(1)
  }
  else {
    arr[index]++
  }
}

/**
 * 在字-数对象中，自动递增一个元素
 * @param o 要添加的对象
 * @param k 修改位置的索引
 */
function autoIncreaseObjectElement(o: { [key: string]: number }, k: string) {
  if (k in o)
    o[k]++
  else
    o[k] = 1
}

export class SegmentAnalyser {
  private _result: RacerResult
  constructor(
    public collisionKeys = '_23456789',
    public commitLength = 4,
  ) {
    this._result = createEmptyRacerResult()
  }

  /**
   * 每次添加一个分词结果对象，分析一些数据
   * @param aSegValue 一个分词结果
   */
  public add(aSegValue: SegValue) {
    let lastCode = ''
    let lastCode2 = ''
    let thisCode = ''
    const result = this._result
    const updateCodes = () => {
      switch (thisCode.length) {
        case 0:break
        case 1:lastCode2 = lastCode
          lastCode = thisCode
          break
        default:lastCode2 = thisCode[thisCode.length - 2]
          lastCode = thisCode[thisCode.length - 1]
          break
      }
    }

    const handleEachValue = (eachValue: SegValue) => {
      if (eachValue.type === 'l') {
        result.lack++
        result.lackSet.add(eachValue.words)
      }
      else {
        // 只关于汉字
        if (eachValue.type === 'c') {
          const tempCodes = eachValue.value.code.replace('↑', '')
          const tempCollision = eachValue.value.collision
          if (tempCodes.length > this.commitLength && tempCollision === 1)
            thisCode = tempCodes
          else
            thisCode = tempCodes + this.collisionKeys[tempCollision - 1]

          const wordsLength = [...eachValue.words].length
          result.hanzi += wordsLength
          result.commit++

          if (wordsLength > 1) {
            result.words++
            result.wordsChar += wordsLength
          }
          autoIncreaseArrayElement(result.wordsDist, wordsLength - 1)

          result.CL += thisCode.length
          autoIncreaseArrayElement(result.CLDist, thisCode.length - 1)

          const tmpCollision = eachValue.value.collision
          if (tmpCollision > 1) {
            result.collision++
            result.collisionChar += wordsLength
          }
          autoIncreaseArrayElement(result.collisionDist, tmpCollision - 1)
        }
        else {
          thisCode = eachValue.code.replace('↑', '')
        }
        // 只要有编码就行
        result.keys += thisCode.length
        // 每个按键
        for (let j = 0; j < thisCode.length; j++) {
          const tmpCode = thisCode[j]
          autoIncreaseObjectElement(result.keysDist, tmpCode)
          result.fingers[feel.keyToFinger[tmpCode]]++
        }
      }
    }

    const handleCombsCode = () => {
      const expandCode = lastCode + thisCode
      for (let i = 1; i < expandCode.length; i++) {
        result.comb++
        const comb = expandCode[i - 1] + expandCode[i]
        const feelMagic = feel.keyPairData[comb]
        result.Eq += feel.getEquivalent(feelMagic)
        if (feel.isDoubleHit(feelMagic))
          result.double++
        if (feel.isSingleSpan(feelMagic))
          result.singleSpan++
        if (feel.isMultiSpan(feelMagic))
          result.multiSpan++
        if (feel.isLongFinersDisturb(feelMagic))
          result.longFingerDisturb++
        if (feel.isLittleFinersDisturb(feelMagic))
          result.littleFingerDisturb++

        const firstFinger = feel.keyToFinger[expandCode[i - 1]]
        const secondFinger = feel.keyToFinger[expandCode[i]]
        if (firstFinger === secondFinger)
          result.sameFingers++

        const isFirstHandLeft = feel.isLeftHand(firstFinger)
        const isSecondHandLeft = feel.isLeftHand(secondFinger)
        if (isFirstHandLeft) {
          if (isSecondHandLeft)
            result.LL++
          else
            result.LR++
        }
        else {
          if (isSecondHandLeft)
            result.RL++
          else
            result.RR++
        }
      }

      const expandCode2 = lastCode2 + expandCode
      for (let i = 2; i < expandCode2.length; i++) {
        if (expandCode2[i - 2] === expandCode2[i - 1] && expandCode2[i - 1] === expandCode2[i])
          result.trible++
      }
    }

    handleEachValue(aSegValue)
    handleCombsCode()
    updateCodes()
  }

  /**
   * 所有的分词添加完成后，调用之，setter 函数会修正数据。
   */
  get result() {
    this._result.Eq /= 10
    return this._result
  }
}
