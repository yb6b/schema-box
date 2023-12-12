import type RawFile from '../platforms/rawFile'

export interface Schema {
  dicts: SchemaDict[]
  cfg: SchemaConfig
  meta?: Record<string, unknown>
}

export interface SchemaConfig {
  /** 配置文件的原始文件 */
  raw?: RawFile
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
  /** 原文件平台 */
  plat?: string
}

export interface SchemaDict {
  items: SchemaDictItem[]
  raw?: RawFile
  /** 最大码长 */
  maxCodeLen?: number
  /** 最大词长 */
  maxWordsLen?: number
}

// export interface SchemaDictItem {
//   /** words 词语 */
//   w: string
//   /** codes 编码 */
//   c: string
//   /** line number 行数 */
//   l: number
//   meta?: Record<string, unknown>
// }

/** 为了减少储存体积，用元组储存每一对词条数据 */
export type SchemaDictItem = [
  words: string,
  codes: string,
  lineNumber: number,
  Meta?: unknown,
]
