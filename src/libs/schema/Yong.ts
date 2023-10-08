import { handleEachLine } from '../utils'
import type { DuoduoEntry } from './DuoDuo'
import { validate } from './keys'
import { FormatError } from './schemaTypes'

/** 处理每个小小格式的词条 */
export function handleYong(src: string, handleEachEntry: (entry: DuoduoEntry) => void) {
  let lineNumber = 0
  handleEachLine(src, (l) => {
    ++lineNumber
    const splitedLine = l.split(' ')

    // validate
    if (!validate(splitedLine[0]))
      throw new FormatError(`第 ${lineNumber} 行的编码用了非法字符作编码：${splitedLine.join(' ')}`)

    if (splitedLine.length < 2)
      throw new FormatError(`第 ${lineNumber} 行的数据不是两个元素：${splitedLine.join('\t')}`)

    for (let i = 1; i < splitedLine.length; i++) {
      handleEachEntry({
        words: splitedLine[i],
        code: splitedLine[0],
        line: lineNumber,
      })
    }
  })
}
