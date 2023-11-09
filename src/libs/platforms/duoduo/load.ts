/**
 * 读取多多码表文件
 */

import type { LoadSchema } from '../platformTypes'
import { FormatError, Schema } from '../platformTypes'
import { genEachLine } from '../utils'
import { parseDuoduoCodes } from './utils'

export const loadDuoduoDict: LoadSchema = async (src) => {
  let lineno = 0
  const result = new Schema()
  const text = await src.getText()
  for (const i of genEachLine(text)) {
    lineno++
    const line = i.trimEnd()
    // jump empty line
    if (!line)
      continue
    // jump header
    if (line.startsWith('---config@'))
      continue
    const lineSplit = i.split('\t')
    if (lineSplit.length !== 2)
      throw new FormatError(`码表第${lineno}行，不是两列。`)
    const codeParsed = parseDuoduoCodes(lineSplit[1])
    result.pushMainDict({
      code: codeParsed.codes,
      words: lineSplit[0],
      line: lineno,
      meta: codeParsed.meta,
    })
  }
  return result
}
