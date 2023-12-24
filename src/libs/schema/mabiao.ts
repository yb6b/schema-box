/**
 * 码表数据以及一些工具函数
 */
import type RawFile from '../platforms/rawFile'

/** 为了减少储存体积，用元组储存每一对词条数据 */
export type MabiaoItem<T = unknown> = [
    words: string,
    codes: string,
    lineNumber: number,
    Meta?: T,
]

/** 码表数据和相关的参数 */
export interface Mabiao<T = unknown> {
  /** 码表数据 */
  items: MabiaoItem<T>[]
  /** 码表数据原始文件 */
  raw?: RawFile
  /** 原文件平台 */
  plat?: string
  /** 码表原始文件里的码表头内容 */
  header?: string
  /** 最大码长 */
  maxCodeLen?: number
  /** 最大词长 */
  maxWordsLen?: number
  /** 原始文件的副本 */
  txt?: string
  /** 方案的名称 */
  name?: string
  /** 方案作者 */
  author?: string
  /** 方案简介 */
  description?: string
  /** 选重键 */
  selectKeys?: string
  /** 上屏码长 */
  cmLen?: number
}

export function createEmptyMabiao(): Mabiao {
  return { items: [] }
}

/** 为了避免编码可能为 __proto__，这里用Map存储数据 */
type CodeToItemsMap = Map<string, MabiaoItem[]>

export function getCodeToWordsDict(items: MabiaoItem[]): CodeToItemsMap {
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
export function maxCodeLen(items: MabiaoItem[]): number {
  let r = 0
  for (const [,code] of items) {
    if (code.length > r)
      r = code.length
  }
  return r
}

/** 求码表里最长的词的字数 */
export function maxWordsLen(items: MabiaoItem[]): number {
  let r = 0
  for (const [words] of items) {
    const l = [...words].length
    if (l > r)
      r = l
  }
  return r
}

/** 用于求编码的按键的种类 */
export function codeSet(items: MabiaoItem[]) {
  const result = new Set<string>()
  for (const [,code] of items) {
    for (const c of code)
      result.add(c)
  }
  return result
}

export function getMabiaoHeader(mb: Mabiao) {
  return mb.header ? `${mb.header}\n` : ''
}
