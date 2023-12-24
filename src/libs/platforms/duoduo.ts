import { createEmptySchema, pushFirstDict } from 'libs/schema/schemaUtils'
import { FormatError } from './platformTypes'
import type { Platform } from './platformTypes'
import { checkCodes, createTextBlob, genEachLine, validateCodes } from './utils'

const sharpControlZi = new Set('固用辅次类序')
function validateDuoduoCodes(codes: string): boolean {
  const sharpSigIndex = codes.indexOf('#')
  if (sharpSigIndex === -1)
    return validateCodes(codes)
  const nextZi = codes[sharpSigIndex + 1]
  return sharpControlZi.has(nextZi)
}

interface DuoduoCodesInfo {
  codes: string
  meta: {
    order?: number
    kind?: number
    fix?: boolean
    user?: boolean
    secondary?: boolean
    support?: boolean
  }
}

function parseDuoduoCodes(src: string): DuoduoCodesInfo {
  const S = src.trim()
  if (!S.includes('#'))
    return { codes: checkCodes(S), meta: {} }

  const srcSplit = src.trim().split('#')
  const result: DuoduoCodesInfo = { codes: checkCodes(srcSplit[0]), meta: {} }
  for (let i = 1; i < srcSplit.length; i++) {
    const element = srcSplit[i]
    switch (element[0]) {
      case '序':
        result.meta.order = Number.parseInt(element.slice(1)); break
      case '类':
        result.meta.kind = Number.parseInt(element.slice(1)); break
      case '次':
        result.meta.secondary = true; break
      case '辅':
        result.meta.support = true; break
      case '用':
        result.meta.user = true; break
      case '固':
        result.meta.fix = true; break
      default:
        throw new TypeError(`无法分析编码「${src}」中的「#${element}」`)
    }
  }
  return result
}

export const platDuoduo: Platform = {
  id: 'duoduo',
  async load(raw) {
    let lineno = 0
    const result = createEmptySchema()
    result.cfg.plat = 'duoduo'
    const text = await raw.getText()
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
  },

  dump(schema): string {
    let result = ''
    for (const item of schema.dicts[0].items)
      result += `${item[0]}\t${item[1]}\n`
    return result
  },

  async validate(raw) {
    const text = await raw.getText()

    // Match table file header.
    if (text.startsWith('---config@'))
      return true

    let lineNo = 0
    // Match code table
    for (let line of genEachLine(text)) {
      // No need to check whole file. 200 lines are enough.
      if (++lineNo > 200)
        return true

      line = line.trim()

      // jump empty line
      if (!line)
        continue

      const lineSplit = line.split('\t')

      // There must be 2 columns.
      if (lineSplit.length !== 2)
        return false

      // the second column must be codes.
      if (!validateDuoduoCodes(lineSplit[1]))
        return false
    }
    return true
  },
}
