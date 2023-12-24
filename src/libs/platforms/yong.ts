import { createEmptySchema, getCodeToWordsDict, pushFirstDict } from '../schema'
import type { Platform } from './platformTypes'
import { FormatError } from './platformTypes'
import { genEachLine, genEachLineFilterEmpty, validateCodes } from './utils'

export const platYong: Platform = {
  async validate(raw) {
    let txt = await raw.getText()
    const match = txt.match(/(.*)\n\[DATA\]\W*\n(.*)/is)
    // 如果有 [DATA] 标志，那就需要处理码表头
    if (match)
      txt = match[2]
    return validateTable(txt)
  },

  async load(raw) {
    let txt = await raw.getText()
    const result = createEmptySchema()
    const match = txt.match(/(.*)\n\[DATA\]\W*\n(.*)/is)
    let lineno = 0
    //  分析码表头
    if (match) {
      result.meta = { header: match[1] }
      for (const line of genEachLine(match[1])) {
        lineno++
        if (!line.trim())
          continue
        const equalSigIndex = line.indexOf('=')
        if (equalSigIndex === -1)
          continue
        const fieldKey = line.slice(0, equalSigIndex)
        const fieldValue = line.slice(equalSigIndex + 1)
        switch (fieldKey) {
          case 'name':
            result.cfg.name = fieldValue
            break
          case 'len':
            result.cfg.cmLen = Number(fieldValue)
            break
        }
      }
      lineno += 2
      txt = match[2]
    }
    // 读取小小码表
    for (const line of genEachLine(txt)) {
      lineno++
      // 过滤空行
      if (!line.trim())
        continue
      // 过滤注释行
      if (line[0] === '#')
        continue
      const [code, ...words] = line.split(' ')
      if (!validateCodes(code))
        throw new FormatError(`码表第 ${lineno} 行 ${line} 的编码 ${code} 不合规`)
      if (words.length < 1)
        throw new FormatError(`码表第 ${lineno} 行 ${line} 没有词条数据`)
      for (const wd of words)
        pushFirstDict(result, [wd, code, lineno])
    }
    return result
  },

  dump(schema) {
    let result = (schema?.meta as { header: string }).header ?? ''
    result += '\n[DATA]\n'
    const d = getCodeToWordsDict(schema.dicts[0].items)
    for (const [code, words] of d.entries())
      result += `${code} ${words.join(' ')}\n`
    return result
  },

}

function validateTable(txt: string) {
  let count = 0
  for (const i of genEachLineFilterEmpty(txt)) {
    if (++count > 40)
      return true
    if (!validateTableLine(i))
      return false
  }
  return true
}

function validateTableLine(line: string): boolean {
  const [code, ...words] = line.trimEnd().split(' ')
  if (!validateCodes(code))
    return false
  if (words.length < 1)
    return false
  return true
}
