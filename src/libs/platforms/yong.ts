import type { Mabiao } from '../schema'
import { createEmptyMabiao, getCodeToWordsDict } from '../schema'

import { genEachLine, genEachLineJump, getMabiaoHeader, validateCodes } from './utils'
import type { RawFile } from './rawFile'
import { FormatError } from './index'

export interface MbYong extends Mabiao {
  plat: 'yong'
  header: string
  raw: RawFile
  yongObj?: Record<string, string>
}

/** 快速验证文件是不是小小格式 */
export async function validatePlatYong(raw: RawFile) {
  let txt = await raw.getText()
  const sigIndex = txt.indexOf('\n[DATA]')
  const sigIndex2 = txt.indexOf('\n[data]')
  const index = sigIndex === -1 ? sigIndex2 : sigIndex
  if (index !== -1)
    txt = txt.slice(index + 8)
  return validateTable(txt)
}

/** 把原始文件转换成小小码表 */
export async function loadPlatYong(raw: RawFile) {
  let txt = await raw.getText()
  const result: MbYong = {
    items: [],
    plat: 'yong',
    raw,
    header: '',
  }
  const sigIndex = txt.indexOf('\n[DATA]')
  const sigIndex2 = txt.indexOf('\n[data]')
  const index = sigIndex === -1 ? sigIndex2 : sigIndex

  let lineno = 0
  if (index !== -1) {
    result.header = txt.slice(0, index)
    const yongOptions: Record<string, string> = {}
    // 解析码表头
    for (const line of genEachLine(result.header)) {
      lineno++
      if (!line.trim())
        continue
      const equalSigIndex = line.indexOf('=')
      if (equalSigIndex === -1)
        continue
      const fieldKey = line.slice(0, equalSigIndex)
      const fieldValue = line.slice(equalSigIndex + 1)
      yongOptions[fieldKey] = fieldValue
      switch (fieldKey) {
        case 'name':
          result.name = fieldValue
          break
        case 'len':
          result.cmLen = Number(fieldValue)
          break
      }
    }
    lineno += 1
    txt = txt.slice(index + 8)
    result.yongObj = yongOptions
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
      result.items.push([wd, code, lineno])
  }
  return result
}

/** 把小小的码表转换成字符串 */
export function dumpPlatYong(mb: Mabiao | MbYong): string {
  let result = getMabiaoHeader(mb, 'yong')
  result += '[DATA]\n'
  const d = getCodeToWordsDict(mb.items)
  for (const [code, words] of d.entries())
    result += `${code} ${words.join(' ')}\n`
  return result
}

function validateTable(txt: string) {
  for (const [line, lno] of genEachLineJump(txt)) {
    if (lno > 40)
      return true
    if (!validateTableLine(line))
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
