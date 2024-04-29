/**
 * 码表数据以及一些工具函数
 * get 系列函数都会在mabiao对象里缓存结果
 */
import type { RawFile } from '../platforms/raw-file'
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
  /** 码表里所有用到的按键 */
  keysSet?: Set<string>
  /** 编码映射到词条组，用于小小等平台 */
  CTI?: CodeToItemsMap
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

export function getCodeToWordsDict(mb: Mabiao) {
  if (mb.CTI)
    return mb.CTI
  const result: CodeToItemsMap = new Map()
  for (const eachItem of mb.items) {
    const c = eachItem[1]
    const o = result.get(c)
    if (o)
      o.push(eachItem)
    else
      result.set(c, [eachItem])
  }
  return mb.CTI = result
}

export function getMaxCodeLen(mb: Mabiao) {
  if (mb.maxCodeLen)
    return mb.maxCodeLen
  let r = 0
  for (const [,code] of mb.items) {
    const codeLen = code.length
    if (codeLen > r)
      r = codeLen
  }
  return mb.maxCodeLen = r
}

export function getMaxWordsLen(mb: Mabiao) {
  if (mb.maxCodeLen)
    return mb.maxCodeLen
  let r = 0
  for (const [words] of mb.items) {
    const l = [...words].length
    if (l > r)
      r = l
  }
  return mb.maxCodeLen = r
}

export function getKeysSet(mb: Mabiao) {
  if (mb.keysSet)
    return mb.keysSet
  const result = new Set<string>()
  for (const [,code] of mb.items) {
    for (const c of code)
      result.add(c)
  }
  return mb.keysSet = result
}

/** 获取选重键，如果没有设置过，则自动判断 */
export function getSelectKeys(mb: Mabiao) {
  if (mb.selectKeys)
    return mb.selectKeys
  const ks = getKeysSet(mb)
  if (!ks.has(';'))
    return mb.selectKeys = ' ;\'456789'
  return mb.selectKeys = ' 23456789'
}

/** 获取码表头数据，需要匹配相应的平台 */
export function getMabiaoHeader(mb: Mabiao, plat: PlatTypes) {
  if (mb.plat === plat && mb.header)
    return `${mb.header}\n`
  return ''
}
