/**
 * 不会引起生僻字切断地提取字符串的子段
 * @param str 被提取的字符串
 * @param [start] 从第几个汉字开始
 * @param [end] 必须是正数
 */
export function sliceString(str: string, start = 0, end = -1): string {
  if (start === 0) {
    if (end === -1)
      return str
    return [...str.slice(0, end * 2)].slice(0, end).join('')
  }

  const startRealIndex = reflectRealIndex(str, start)
  if (end === -1)
    return str.slice(startRealIndex)
  return [...str.slice(startRealIndex, end * 2)].slice(0, end).join('')
}

export function reflectRealIndex(str: string, utf32_index: number): number {
  const strlen = str.length
  const index_minus = utf32_index - 1
  let count = 0
  for (let i = 0; i < strlen; i++) {
    const charCode = str.charCodeAt(i)
    const is1word = charCode < 0xD800 as unknown as number
    count += is1word
    if (count === index_minus)
      return i + 1
  }
  return -1
}

/** 统计字符串里汉字字符的数量 */
export function countHanzi(src: string): number {
  const re = /\p{Ideo}/gu
  const m = src.match(re)
  return m ? m.length : 0
}

/** 删除文件名的后缀名 */
export function removeFileNameExt(filename: string) {
  return filename.replace(/\.\w+$/, '')
}

export function* genEachLine(src: string) {
  const lineBreakerPattern = /\r?\n|\r/g
  let last = 0
  let match = lineBreakerPattern.exec(src)
  while (match) {
    yield src.slice(last, match.index)
    last = match.index + match[0].length
    match = lineBreakerPattern.exec(src)
  }
  yield src.slice(last)
}

/**
 * 迭代每一行，会过滤空行，同时返回每一行的行数
 * @param src
 */
export function* genEachLineJump(src: string) {
  let lineNumber = 0
  for (const line of genEachLine(src)) {
    lineNumber++
    if (!line.trim())
      continue
    yield [line, lineNumber] as const
  }
}

/** 解析TSV格式 */
export function parseTsv(txt: string) {
  const rs = []
  for (const e of genEachLine(txt)) {
    if (e.trim() === '')
      continue
    rs.push(e.split('\t'))
  }
  return rs
}
