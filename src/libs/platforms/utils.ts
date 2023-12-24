export { checkCodes, validateCodes } from '../schema/keys'

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
 * 迭代每一行，会过滤空行
 * @param src
 */
export function* genEachLineFilterEmpty(src: string) {
  for (let line of genEachLine(src)) {
    line = line.trimEnd()
    if (!line)
      continue
    yield line
  }
}

export function createTextBlob(content: string) {
  return new Blob([content], { type: 'text/plain;charset=utf-8' })
}

export function saveFile<T extends Blob>(aFile: T, filename: string) {
  const href = window.URL.createObjectURL(aFile)
  const downloadElement = document.createElement('a')
  downloadElement.style.display = 'none'
  downloadElement.href = href
  downloadElement.download = filename
  document.body.appendChild(downloadElement)
  downloadElement.click()
  document.body.removeChild(downloadElement)
  URL.revokeObjectURL(href)
}
