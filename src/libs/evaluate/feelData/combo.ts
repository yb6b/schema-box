/**
 * 按键组合的手感的数据
 */

import { KEYS_MAIN } from 'libs/constants'
import ComboDataJson from './comboFeelData.js'

// JSON.parse解析速度比js对象更快。
const comboData: number[][] = JSON.parse(ComboDataJson)
/** 共46键的数据 */
export const KEYS = [...`${KEYS_MAIN} `]
const LEFT_SET = new Set(KEYS.slice(0, 20))

interface ComboFeelValue {
  /** 当量 */
  eq: number
  /** 错手 */
  lfd: boolean
  /** 小指干扰 */
  pd: boolean
  /** 同指小跨排 */
  ss: boolean
  /** 同指大跨排 */
  ms: boolean
  /** 左右手互击 */
  dh: boolean
  /** 二连击 */
  dc: boolean
}

/** 两键组合的手感数据, 共46键, 包括空格 */
const comboFeelData: Record<string, ComboFeelValue> = {}

KEYS.forEach((v, i) => {
  KEYS.forEach((v2, i2) => {
    const magic = comboData[i][i2]
    comboFeelData[v + v2] = {
      eq: (magic & 0x1F) / 10,
      dc: v === v2,
      dh: (LEFT_SET.has(v) && !LEFT_SET.has(v2)) || (!LEFT_SET.has(v) && LEFT_SET.has(v2)),
      pd: !!((magic >> 5) & 1),
      ss: !!((magic >> 6) & 1),
      lfd: !!((magic >> 7) & 1),
      ms: !!((magic >> 8) & 1),
    }
  })
})

export { comboFeelData }
