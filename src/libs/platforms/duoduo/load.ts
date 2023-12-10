/**
 * 读取多多码表文件
 */

import { createEmptySchema, pushFirstDict } from 'libs/schema/schemaUtils'
import type { LoadSchema } from '../platformTypes'
import { FormatError } from '../platformTypes'
import { genEachLine } from '../utils'
import { parseDuoduoCodes } from './utils'

export const loadDuoduoDict: LoadSchema = async (src) => {
  let lineno = 0
  const result = createEmptySchema()
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
    try {
      const codeParsed = parseDuoduoCodes(lineSplit[1])
      pushFirstDict(result, [
        lineSplit[0],
        codeParsed.codes,
        lineno,
        codeParsed.meta,
      ])
    }
    catch (error) {
      if (error instanceof Error)
        throw new FormatError(`码表第${lineno}行，编码错误\n${error.message}`)
    }
  }
  return result
}
