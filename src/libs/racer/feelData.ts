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

export const enum Fingers {
  leftFore,
  leftMiddle,
  leftRing,
  leftLittle,
  rightFore,
  rightMiddle,
  rightRing,
  rightLittle,
  thumb,
}

export const keyToFinger: Record<string, Fingers> = {
  '←': Fingers.rightLittle,
  '1': Fingers.leftLittle,
  'q': Fingers.leftLittle,
  'a': Fingers.leftLittle,
  'z': Fingers.leftLittle,
  '2': Fingers.leftRing,
  'w': Fingers.leftRing,
  's': Fingers.leftRing,
  'x': Fingers.leftRing,
  '3': Fingers.leftMiddle,
  'e': Fingers.leftMiddle,
  'd': Fingers.leftMiddle,
  'c': Fingers.leftMiddle,
  '4': Fingers.leftFore,
  'r': Fingers.leftFore,
  'f': Fingers.leftFore,
  'v': Fingers.leftFore,
  '5': Fingers.leftFore,
  't': Fingers.leftFore,
  'g': Fingers.leftFore,
  'b': Fingers.leftFore,
  '6': Fingers.rightFore,
  'y': Fingers.rightFore,
  'h': Fingers.rightFore,
  'n': Fingers.rightFore,
  '7': Fingers.rightFore,
  'u': Fingers.rightFore,
  'j': Fingers.rightFore,
  'm': Fingers.rightFore,
  '8': Fingers.rightMiddle,
  'i': Fingers.rightMiddle,
  'k': Fingers.rightMiddle,
  ',': Fingers.rightMiddle,
  '9': Fingers.rightRing,
  'o': Fingers.rightRing,
  'l': Fingers.rightRing,
  '.': Fingers.rightRing,
  '0': Fingers.rightLittle,
  'p': Fingers.rightLittle,
  ';': Fingers.rightLittle,
  '/': Fingers.rightLittle,
  '-': Fingers.rightLittle,
  '[': Fingers.rightLittle,
  '\'': Fingers.rightLittle,
  '=': Fingers.rightLittle,
  ']': Fingers.rightLittle,
  '\\': Fingers.rightLittle,
  '_': Fingers.thumb,
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
