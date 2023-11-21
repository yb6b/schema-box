/**
 * 键位的基础数据
 */
import { KEYS_ALL } from '../constants'

type RSS = Record<string, string>

type PunctuationsData = Record<'uni' | 'cn' | 'en', RSS>

function mixStr(str: string, other: object) {
  const r: RSS = {}
  for (const s of str)
    r[s] = s
  return Object.assign(r, other)
}

export const PUNCTUATIONS: PunctuationsData = {
  // 中英文都能打出的字符
  uni: mixStr('0123456789=+-~@%#&* ', {
    '\n': '↩', // 换行
    '\r\n': '↩', // 换行
    '\r': '↩', // 换行
    '\t': '→', // Tab符
  }),
  // 常见的中文标点
  cn: {
    '·': '`',
    '——': '_',
    '—': '_←',
    '‘': '\'',
    '’': '\'',
    '“': '"',
    '”': '"',
    '……': '^',
    '…': '^←',
    '、': '/',
    '。': '.',
    '《': '<',
    '》': '>',
    '【': '[',
    '】': ']',
    '！': '!',
    '（': '(',
    '）': ')',
    '，': ',',
    '：': ':',
    '；': ';',
    '？': '?',
    '￥': '$',
  },
  // 需要切换成英文模式后才能打出的英文符号
  en: mixStr('\',./\\[]`abcdefghijklmnopqrstuvwxyz{}^_:;<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ"$()', {}),

}

/**
 * 验证编码是否合规
 * @param code 待验证的编码
 * @returns 能否成功
 */
export function validateCodes(code: string) {
  const ALL_KEYS_SET = new Set(KEYS_ALL)
  for (let i = 0; i < code.length; i++) {
    if (!ALL_KEYS_SET.has(code[i]))
      return false
  }
  return true
}

/**
 * 读取并返回一个方案编码字符串
 * @throws 不合规的编码报错
 */
export function checkCodes(code: string) {
  const ALL_KEYS_SET = new Set(KEYS_ALL)
  for (let i = 0; i < code.length; i++) {
    if (!ALL_KEYS_SET.has(code[i]))
      throw new TypeError(`${code} 中的第 ${i + 1} 个字母不是合规的编码。`)
  }
  return code
}
