/**
 * 按键组合的手感的数据
 */

import { KEYS_NO_SHIFT } from '../../constants'
import ComboDataJson from './comboFeelData.js'

// JSON.parse解析速度比js对象更快。
const comboData: number[][] = JSON.parse(ComboDataJson)
const key40 = [...KEYS_NO_SHIFT.substring(0, 40)]

 type KeyPairMagicNumber = number
 type KeyPairMagicNumberData = Record<string, KeyPairMagicNumber>
const _tmpKeyPair: KeyPairMagicNumberData = {}

key40.forEach((v, i) => {
  key40.forEach((v2, i2) => {
    _tmpKeyPair[v + v2] = comboData[i][i2]
  })
})
/**
 * 这个对象的键是按键组合（只有40个键，且没有大写的），
 * 数据量大, 请使用异步import
 *
 * 对象的值是组合的手感数据，压缩进一个数字里，从低位开始分别指：
 * - 1~5位：陈一凡当量表的数据乘以10，是个整数
 * - 6位：组合是不是左右互击？
 * - 7位：组合是不是二连击？
 * - 8位：组合是不是小指干扰？
 * - 9位：组合是不是同指小跨排？
 * - 10位：组合是不是错手？
 * - 11位：组合是不是同指大跨排？
 */
export const comboFeelData: KeyPairMagicNumberData = _tmpKeyPair
