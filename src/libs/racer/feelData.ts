/**
 * @file 手感相关的数据。为了减小源码体积，用位运算把数据存到魔法数字中
 * 由于数据较多，建议打包时独立成chunk
 */
import { ALL_KEYS } from '../schema/keys'
import rawKeyData from './keyData.json'

const key40 = [...ALL_KEYS.substring(0, 40)]

type TenTimedEquivalent = number

export function getEquivalent(i: KeyPairMagicNumber): TenTimedEquivalent {
  return i & 0x1F
}

export function isDifferentHand(i: KeyPairMagicNumber) {
  return !!(i & 0x20)
}

export function isDoubleHit(i: KeyPairMagicNumber) {
  return !!(i & 0x40)
}

export function isSingleSpan(i: KeyPairMagicNumber) {
  return !!(i & 0x100)
}

export function isMultiSpan(i: KeyPairMagicNumber) {
  return !!(i & 0x400)
}

export function isLongFinersDisturb(i: KeyPairMagicNumber) {
  return !!(i & 0x200)
}

export function isLittleFinersDisturb(i: KeyPairMagicNumber) {
  return !!(i & 0x80)
}

export type Fingers = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export const keyToFinger: Record<string, Fingers> = {
  '_': 0,
  '1': 1,
  'q': 1,
  'a': 1,
  'z': 1,
  '2': 2,
  'w': 2,
  's': 2,
  'x': 2,
  '3': 3,
  'e': 3,
  'd': 3,
  'c': 3,
  '4': 4,
  'r': 4,
  'f': 4,
  'v': 4,
  '5': 4,
  't': 4,
  'g': 4,
  'b': 4,
  '6': 7,
  'y': 7,
  'h': 7,
  'n': 7,
  '7': 7,
  'u': 7,
  'j': 7,
  'm': 7,
  '8': 8,
  'i': 8,
  'k': 8,
  ',': 8,
  '9': 9,
  'o': 9,
  'l': 9,
  '.': 9,
  '0': 10,
  'p': 10,
  ';': 10,
  '/': 10,
  '-': 10,
  '[': 10,
  '\'': 10,
  '=': 10,
  ']': 10,
  '\\': 10,
  '←': 10,
}

export function isLeftHand(keyIndex: Fingers) {
  return keyIndex < 4
}

export type KeyPairMagicNumber = number
export type KeyPairMagicNumberData = Record<string, KeyPairMagicNumber>
const _tmpKeyPair: KeyPairMagicNumberData = {}

key40.forEach((v, i) => {
  key40.forEach((v2, i2) => {
    _tmpKeyPair[v + v2] = rawKeyData[i][i2]
  })
})
/**
 * 保存了陈一凡当量数据（为了取整，数字乘十）、以及
 * 法月的《科学形码测评系统》中的 左右互击、二连击、同指大跨排、同指小跨排、小指干扰、错手
 */
export const keyPairData: KeyPairMagicNumberData = _tmpKeyPair
