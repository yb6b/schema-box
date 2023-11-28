import type { SchemaDict, SchemaDictItem } from './schemaTypes'

/** 为了避免编码可能为 __proto__，这里用Map存储数据 */
export type CodeToItemsMap = Map<string, SchemaDictItem[]>

export function getCodeToWordsDict(items: SchemaDictItem[]): CodeToItemsMap {
  const result: CodeToItemsMap = new Map()
  for (const eachItem of items) {
    const c = eachItem[1]
    const o = result.get(c)
    if (o)
      o.push(eachItem)
    else
      result.set(c, [eachItem])
  }
  return result
}

/** 求一个码表里的最大码长 */
export function maxCodeLen(items: SchemaDictItem[]): number {
  let r = 0
  for (const [,code] of items) {
    if (code.length > r)
      r = code.length
  }
  return r
}

/** 求码表里最长的词的字数 */
export function maxWordsLen(items: SchemaDictItem[]): number {
  let r = 0
  for (const [words] of items) {
    const l = [...words].length
    if (l > r)
      r = l
  }
  return r
}

/** 用于求编码的按键的种类 */
export function codeSet(items: SchemaDictItem[]) {
  const result = new Set<string>()
  for (const [,code] of items) {
    for (const c of code)
      result.add(c)
  }
  return result
}
