import { type Mabiao, createEmptyMabiao } from '../schema'
import { checkCodes, genEachLineJump, getMabiaoHeader, validateCodes } from './utils'
import type RawFile from './rawFile'
import { FormatError } from './index'

interface DuoduoMeta {
  order?: number
  kind?: number
  fix?: boolean
  user?: boolean
  secondary?: boolean
  support?: boolean
}
interface DuoduoCodesInfo {
  codes: string
  meta: DuoduoMeta
}

export interface MbDuoduo extends Mabiao<DuoduoMeta> {
  plat: 'duoduo'
  header: string
  raw: RawFile
}

const sharpControlZi = new Set('固用辅次类序')
function validateDuoduoCodes(codes: string): boolean {
  const sharpSigIndex = codes.indexOf('#')
  if (sharpSigIndex === -1)
    return validateCodes(codes)
  const nextZi = codes[sharpSigIndex + 1]
  return sharpControlZi.has(nextZi)
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

/** 读取文件，转成码表对象 */
export async function loadPlatDuoduo(raw: RawFile) {
  const text = await raw.getText()
  const result = createEmptyMabiao() as MbDuoduo
  result.plat = 'duoduo'
  result.raw = raw
  let header = ''
  for (const [line, lineno] of genEachLineJump(text)) {
    // jump header
    if (line.startsWith('---config@')) {
      header += `${line}\n`
      continue
    }
    const lineSplit = line.split('\t')
    if (lineSplit.length !== 2)
      throw new FormatError(`码表第${lineno}行，不是两列。`)
    try {
      const codeParsed = parseDuoduoCodes(lineSplit[1])
      result.items.push([lineSplit[0], codeParsed.codes, lineno, codeParsed.meta])
    }
    catch (error) {
      if (error instanceof Error)
        throw new FormatError(`码表第${lineno}行，编码错误\n${error.message}`)
    }
  }
  result.header = header
  return result
}

/** 快速判断文件是不是多多格式 */
export async function validatePlatDuoduo(raw: RawFile) {
  const text = await raw.getText()

  // Match table file header.
  if (text.startsWith('---config@'))
    return true

  // Match code table
  for (const [line, lineno] of genEachLineJump(text)) {
    // No need to check whole file. 200 lines are enough.
    if (lineno > 200)
      return true

    const lineSplit = line.split('\t')

    // There must be 2 columns.
    if (lineSplit.length !== 2)
      return false

    // the second column must be codes.
    if (!validateDuoduoCodes(lineSplit[1]))
      return false
  }
  return true
}

/** 把码表对象转成字符串 */
export function dumpPlatDuoduo(mb: Mabiao | MbDuoduo): string {
  let result = getMabiaoHeader(mb, 'duoduo')
  for (const item of mb.items)
    result += `${item[0]}\t${item[1]}\n`
  return result
}
