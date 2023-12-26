import { type Mabiao, createEmptyMabiao } from 'libs/schema'

// @ts-expect-error special import of js-yaml
import { load } from 'js-yaml'
import { checkCodes, genEachLineJump, getMabiaoHeader } from './utils'

import type { RawFile } from './rawFile'
import { FormatError } from './index'

export interface MbRime extends Mabiao {
  plat: 'rime'
  name: string
  raw: RawFile
  /** 码表数据里编码在前 还是词语在前 */
  codeFirst: boolean
  header?: string
  rimeObj?: object
}

/** 快速判断文件是不是rime格式, 内部仅仅通过几个正则作判断 */
export async function validatePlatRime(raw: RawFile) {
  if (raw.name.match(/\.dict\.yaml$/))
    return true
  const txt = await raw.getText()
  if (txt.startsWith('# Rime dictionary'))
    return true
  if (txt.match(/^.*\n---.*\n\.\.\./is))
    return true
  return false
}

/** 读取文件，转换成码表 */
export async function loadPlatRime(raw: RawFile) {
  // 提取出码表头
  let txt = await raw.getText()
  const result = createEmptyMabiao() as unknown as MbRime
  result.plat = 'rime'
  result.name = raw.name
  result.raw = raw
  result.codeFirst = false
  const match = txt.match(/^(.*\n---(.*)\n\.\.\.)(.*)/is)

  if (match && match[2]) {
    // 转换yaml对象
    const yamlObj = load(match[2], { filename: raw.name })
    // 有用的参数
    if (yamlObj)
      result.rimeObj = yamlObj
    if (yamlObj.name)
      result.name = yamlObj.name

    if (yamlObj.columns) {
      const col = yamlObj.columns
      if (col.length > 1 && yamlObj.columns[0] === 'code' && yamlObj.columns[1] === 'text')
        result.codeFirst = true
    }
    result.header = match[1]
    txt = match[3]
  }
  const headerLinesCount = result.header ? [...result.header.matchAll(/\n/g)].length : 0
  // 处理码表数据
  for (const [line, lno] of genEachLineJump(txt)) {
    // 跳过注释行
    if (line[0] === '#')
      continue
    const realLineNo = lno + headerLinesCount
    const lineSplit = line.split('\t')
    if (lineSplit.length < 2)
      throw new FormatError(`Rime码表 ${raw.name} 中的第 ${realLineNo} 行缺少tab`)
    let cd = result.codeFirst ? lineSplit[0] : lineSplit[1]
    cd = checkCodes(cd)
    const wd = result.codeFirst ? lineSplit[1] : lineSplit[0]
    result.items.push([wd, cd, realLineNo])
  }
  return result
}

/** 把码表对象转换成rime格式的字符串 */
export function dumpPlatRime(mb: Mabiao | MbRime): string {
  let result = getMabiaoHeader(mb, 'rime')
  let codeFirst = false

  // 处理码表头
  if (mb.plat === 'rime')
    codeFirst = !!(mb as MbRime).codeFirst

  // 添加码表数据
  if (codeFirst) {
    for (const e of mb.items)
      result += `${e[1]}\t${e[0]}\n`
  }
  else {
    for (const e of mb.items)
      result += `${e[0]}\t${e[1]}\n`
  }
  return result
}
