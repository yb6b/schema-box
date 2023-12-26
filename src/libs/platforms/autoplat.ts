/**
 * 自动判断码表格式，要求：
 * 只能用 tab 或 空格 分隔，分隔符必须全码表一致。
 * 编码只能用有限的字母和标点
 * 编码只能在最左列或最右列
 * 一行可以有多个词条
 */

import type { Mabiao } from 'libs/schema'
import { getCodeToWordsDict } from 'libs/schema'

import { checkCodes, genEachLine, genEachLineJump, validateCodes } from './utils'
import type { RawFile } from './rawFile'
import { FormatError } from './index'

type SplitSpace = ' ' | '\t'
interface AutoFormat {
  /** 分隔符 */
  split: SplitSpace
  /** 编码在前，还是在最后一列 */
  ahead: boolean
}

export interface MbAuto extends Mabiao {
  format: AutoFormat
  plat: 'auto'
  raw: RawFile
}

/** 读取自动判断格式的码表，要提供格式对象，可以通过 validatePlatAuto 获得 */
export async function loadPlatAuto(raw: RawFile, format: AutoFormat) {
  const mb = { plat: 'auto', format, items: [], raw } as MbAuto
  const text = await raw.getText()
  let lineno = 0
  for (const line of genEachLine(text)) {
    lineno++
    // 过滤空行
    if (!line.trim())
      continue
    const wordsSplit = line.split(format.split)
    if (wordsSplit.length === 1)
      throw new FormatError(`第 ${lineno} 行只有一列数据`)
    if (format.ahead) {
      const codes = checkCodes(wordsSplit[0])
      for (const w of wordsSplit.slice(1)) {
        if (w === '')
          continue
        mb.items.push([w, codes, lineno])
      }
    }
    else {
      const lastIndex = wordsSplit.length - 1
      const codes = wordsSplit[lastIndex]
      for (const w of wordsSplit.slice(0, lastIndex)) {
        if (w === '')
          continue
        mb.items.push([w, codes, lineno])
      }
    }
  }
  return mb
}

/** 自动检查码表的格式，返回推测的格式，如果返回null，则无法推断出来 */
export async function detectPlatAuto(raw: RawFile) {
  const text = await raw.getText()
  for (const [line] of genEachLineJump(text)) {
    // 只担心词条是纯英文的
    const tabindex = line.indexOf('\t')
    const spaceindex = line.indexOf(' ')
    if (tabindex === -1) {
      if (spaceindex === -1)
        // 没有分隔符
        return null
      // 只有 space
      const f = detectFormat(line, spaceindex, ' ')
      if (f)
        return f
    }
    else {
      if (spaceindex === -1) {
        // 只有 tab
        const f = detectFormat(line, tabindex, '\t')
        if (f)
          return f
      }
      // tab 和 空格都有
      else {
        // 尝试tab
        let f = detectFormat(line, tabindex, '\t')
        if (f)
          return f
        // 尝试空格
        f = detectFormat(line, spaceindex, ' ')
        if (f)
          return f
      }
    }
  }
  // 整个码表都推断不出，只可能是纯英文码表了，没有办法
  return null
}

/**
 * 把自动推测的码表转成字符串，
 * @param mb 输入的码表, 必须是MbAuto类型
 * @param [fold] 是否一行多个词语？
 */
export function dumpPlatAuto(mb: MbAuto, fold = false): string {
  const format = mb.format
  if (!format)
    throw new FormatError('fail: dump platAuto - no format')
  let res = ''

  // 每行只有一条词
  if (!fold) {
    for (const [words, codes] of mb.items) {
      if (format.ahead)
        res += `${codes}${format.split}${words}\n`
      else
        res += `${words}${format.split}${codes}\n`
    }
    return res
  }

  // 每行多词

  const r = [...getCodeToWordsDict(mb.items).entries()]
  for (const [codes, items] of r) {
    const words = items.map(v => v[0]).join(format.split)
    if (format.ahead)
      res += `${codes}${format.split}${words}\n`
    else
      res += `${words}${format.split}${codes}\n`
  }
  return res
}

/** 返回null暗示了词语是英文 */
function detectFormat(line: string, firstIndex: number, space: SplitSpace): AutoFormat | null {
  const lastIndex = line.lastIndexOf(space)
  const codeAhead = validateCodes(line.slice(0, firstIndex))
  const lastIsCode = validateCodes(line.slice(lastIndex + 1))
  if (codeAhead && !lastIsCode)
    return { split: space, ahead: true }

  if (!codeAhead && lastIsCode)
    return { split: space, ahead: false }
  return null
}

/** 快速转换码表 */
export async function loadPlatAutoDirectly(raw: RawFile) {
  const fmt = await detectPlatAuto(raw)
  if (!fmt)
    throw new FormatError(`无法推断出${raw.name}的分隔符`)
  return await loadPlatAuto(raw, fmt)
}
