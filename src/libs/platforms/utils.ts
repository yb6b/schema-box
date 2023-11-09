export { checkCodes } from '../schema/keys'

// export function handleEachLine(src: string, handler: (eachLine: string) => void) {
//   const lineBreakerPattern = /\r?\n|\r/g
//   let last = 0
//   let match = lineBreakerPattern.exec(src)
//   while (match) {
//     handler(src.slice(last, match.index))
//     last = match.index + match[0].length
//     match = lineBreakerPattern.exec(src)
//   }
//   handler(src.slice(last))
// }

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
