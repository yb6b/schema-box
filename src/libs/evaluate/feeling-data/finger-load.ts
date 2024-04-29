/**
 * 用指当量, 估测手指的疲劳度
 * @link https://workmanlayout.org/
 */
import { mapValues } from 'remeda'

const fingerLoadRaw = {
  'q': 4,
  'a': 1.5,
  'z': 4,
  'w': 2,
  's': 1,
  'x': 4,
  'e': 2,
  'd': 1,
  'c': 3,
  'r': 3,
  'f': 1,
  'v': 2,
  't': 4,
  'g': 3,
  'b': 5,
  'y': 5,
  'h': 3,
  'n': 3,
  'u': 3,
  'j': 1,
  'm': 2,
  'i': 2,
  'k': 1,
  ',': 3,
  'o': 2,
  'l': 1,
  '.': 4,
  'p': 4,
  ';': 1.5,
  '/': 4,
} as const

// 再转换成键频
export const fingerLoad = mapValues(fingerLoadRaw, v => 1 / v)
