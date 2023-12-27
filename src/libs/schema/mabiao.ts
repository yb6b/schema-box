/**
 * 码表数据以及一些工具函数
 */
import type { RawFile } from '../platforms/rawFile'
import type { PlatTypes } from '../platforms'

/** 为了减少储存体积，用元组储存每一对词条数据 */
export type MabiaoItem<T = object> = [
    words: string,
    codes: string,
    lineNumber: number,
    Meta?: T,
]

/** 码表数据和相关的参数 */
export interface Mabiao<T = object> {
  /** 码表数据 */
  items: MabiaoItem<T>[]
  /** 码表数据原始文件 */
  raw?: RawFile
  /** 原文件平台 */
  plat?: PlatTypes
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

/** 从文件里获取到的码表, 几个字段不可省略 */
export interface MabiaoFile<T = object> extends Mabiao<T> {
  items: MabiaoItem<T>[]
  raw: RawFile
  plat: PlatTypes
  header: string
  name: string
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
export function keysSet(items: MabiaoItem[]) {
  const result = new Set<string>()
  for (const [,code] of items) {
    for (const c of code)
      result.add(c)
  }
  return result
}

/**
 * 推测选重键
 * @param keysSet 全部按键的 Set, 可以用 codeSet() 函数求得
 * @returns 选重键
 */
export function detectSellectKeys(keysSet: Set<string>) {
  if (!keysSet.has(';'))
    return ' ;\'456789'
  return ' 23456789'
}

export function getMabiaoHeader(mb: Mabiao, plat: PlatTypes) {
  if (mb.plat === plat && mb.header)
    return `${mb.header}\n`
  return ''
}
