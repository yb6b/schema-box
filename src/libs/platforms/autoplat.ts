/**
 * 自动判断码表格式，要求：
 * 只能用 tab 或 空格 分隔，分隔符必须全码表一致。
 * 编码只能用有限的字母和标点
 * 编码只能在最左列或最右列
 * 一行可以有多个词条
 */

import { createEmptySchema, pushFirstDict } from 'libs/schema/schemaUtils'
import type { Platform } from './platformTypes'
import { FormatError } from './platformTypes'
import { checkCodes, genEachLine, validateCodes } from './utils'

type SplitSpace = ' ' | '\t'
interface autoFormat {
  /** 分隔符 */
  split: SplitSpace
  /** 编码在前，还是在最后一列 */
  ahead: boolean
}

/** 必须先validate再load，不然无法识别 */
export const platAuto: Platform & { format?: autoFormat } = {
  id: 'auto',
  async load(raw) {
    if (!this.format)
      throw new FormatError('没有格式信息，请先运行 platAuto.validate()')
    const format = this.format
    const text = await raw.getText()
    const res = createEmptySchema()
    let lineno = 0
    for (const line of genEachLine(text)) {
      lineno++
      // 过滤空行
      if (!line.trim())
        continue
      const wordsSplit = line.split(format.split)
      if (wordsSplit.length === 1)
        throw new FormatError(`第${lineno}行只有一列数据`)

      if (format.ahead) {
        const codes = checkCodes(wordsSplit[0])
        for (const w of wordsSplit.slice(1)) {
          if (!w.length)
            continue
          pushFirstDict(res, [w, codes, lineno])
        }
      }
      else {
        const lastIndex = wordsSplit.length - 1
        const codes = wordsSplit[lastIndex]
        for (const w of wordsSplit.slice(0, lastIndex)) {
          if (!w.length)
            continue
          pushFirstDict(res, [w, codes, lineno])
        }
      }
    }
    return res
  },

  /** auto 的验证比较特殊，它只推断分割符和编码的位置。 */
  async validate(raw) {
    const text = await raw.getText()
    for (const line of genEachLine(text)) {
      if (!line.trim())
        continue

      // 只担心词条是纯英文的
      const tabindex = line.indexOf('\t')
      const spaceindex = line.indexOf(' ')
      if (tabindex === -1) {
        if (spaceindex === -1)
          // 没有分隔符
          return false
        // 只有 space
        const f = detectFormat(line, spaceindex, ' ')
        if (f) {
          this.format = f
          return true
        }
      }
      else {
        if (spaceindex === -1) {
          // 只有 tab
          const f = detectFormat(line, tabindex, '\t')
          if (f) {
            this.format = f
            return true
          }
        }
        // tab 和 空格都有
        else {
          // 尝试tab
          let f = detectFormat(line, tabindex, '\t')
          if (f) {
            this.format = f
            return true
          }
          // 尝试空格
          f = detectFormat(line, spaceindex, ' ')
          if (f) {
            this.format = f
            return true
          }
        }
      }
    }
    // 整个码表都推断不出，只可能是纯英文码表了，没有办法
    return false
  },

  /** 按照 this.format 格式转换 */
  dump(schema) {
    const format = this.format
    if (!format)
      throw new FormatError('fail: dump platAuto - no this.format')
    let res = ''
    for (const [words, codes] of schema.dicts[0].items)
      res += format.ahead ? `${codes}${format.split}${words}\n` : `${words}${format.split}${codes}\n`
    return res
  },
}

/** 返回null暗示了词语是英文 */
function detectFormat(line: string, firstIndex: number, space: SplitSpace): autoFormat | null {
  const lastIndex = line.lastIndexOf(space)
  const firstIsCode = validateCodes(line.slice(0, firstIndex))
  const lastIsCode = validateCodes(line.slice(lastIndex + 1))
  if (firstIsCode && !lastIsCode)
    return { split: space, ahead: true }

  if (!firstIsCode && lastIsCode)
    return { split: space, ahead: false }
  return null
}
