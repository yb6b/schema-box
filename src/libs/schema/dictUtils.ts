import type { SchemaDict, SchemaDictItem } from './schema'

/** 为了避免编码可能为 __proto__，这里用Map存储数据 */
export type CodeToItemsMap = Map<string, SchemaDictItem[]>

export function getCodeToWordsDict(items: SchemaDictItem[]): CodeToItemsMap {
  const result: CodeToItemsMap = new Map()
  for (const eachItem of items) {
    const { c: code } = eachItem
    const o = result.get(code)
    if (o)
      o.push(eachItem)
    else
      result.set(code, [eachItem])
  }
  return result
}

/** 求一个码表里的最大码长 */
export function maxCodeLen(items: SchemaDictItem[]): number {
  let r = 0
  for (const { c: code } of items) {
    if (code.length > r)
      r = code.length
  }
  return r
}

/** 求码表里最长的词的字数 */
export function maxWordsLen(items: SchemaDictItem[]): number {
  let r = 0
  for (const { w: words } of items) {
    const l = [...words].length
    if (l > r)
      r = l
  }
  return r
}

/** 用于求编码的按键的种类 */
export function codeSet(items: SchemaDictItem[]) {
  const result = new Set<string>()
  for (const { c: code } of items) {
    for (const c of code)
      result.add(c)
  }
  return result
}
