import { handleEachLine } from '../utils'
import { validate } from './keys'
import { FormatError } from './schemaTypes'

const DUODUO_SIGS = new Set('序类次辅用固')
const DUODUO_DICT_RULE_URL = 'http://chinput.vninv.com/docs/ddimegen/guifan_mabiaogeshi.htm'

export interface DuoduoEntry {
  words: string
  code: string
  line: number
}

export function handleDuoduo(src: string, handleEachEntry: (entry: DuoduoEntry) => void) {
  let lineno = 0
  handleEachLine(src, (l) => {
    ++lineno
    if (isDuoduoHeader(l) || isEmptyLine(l))
      return

    const splitedLine = l.split('\t')
    validateSplittedLine(splitedLine, lineno)
    handleEachEntry({
      words: splitedLine[0],
      code: splitedLine[1],
      line: lineno,
    })
  })
}

function isDuoduoHeader(line: string) {
  return line.startsWith('---config')
}

function isEmptyLine(line: string) {
  return !line.trim()
}

function validateSplittedLine(line: string[], lineNumber: number) {
  if (!validate(line[1]))
    throw new FormatError(`第 ${lineNumber} 行的编码用了非法字符作编码：${line.join('\t')}`)

  if (line.length !== 2)
    throw new FormatError(`第 ${lineNumber} 行的数据不是两个元素：${line.join('\t')}`)
}
