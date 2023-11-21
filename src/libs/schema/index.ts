import type RawFile from '../platforms/rawFile'

/**
 * 字词型的输入法方案，包含多个码表对象和一些公共配置。
 *
 * ```js
 * new Schema() // 生成空的对象
 * ```
 */
export class Schema {
  constructor() {
    this.dicts = [new SchemaDict()]
  }

  dicts: SchemaDict[]
  cfg: SchemaConfig = {}
  /** 平台相关的其他信息 */
  meta?: Record<string, unknown>

  pushFirstDict(item: SchemaDictItem) {
    return this.dicts[0].items.push(item)
  }

  dictsItemsCount() {
    let r = 0
    for (const i of this.dicts)
      r += i.items.length
    return r
  }
}

export interface SchemaConfig {
  /** 配置文件的原始文件 */
  raw?: RawFile
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

export class SchemaDict {
  constructor() {}
  /** 按码表顺序的每个词条 */
  items: SchemaDictItem[] = []
  /** 码表的原始文件 */
  raw?: RawFile
  /**
   * 编码 - 候选词语的列表
   * 修改items后，清空它
   */
  c2w?: Record<string, SchemaDictItem[]>

  getC2w() {
    // check cached
    if (this.c2w)
      return this.c2w
    const c2wResult: Record<string, SchemaDictItem[]> = {}
    for (const eachItem of this.items) {
      const { code } = eachItem
      if (code in c2wResult)
        c2wResult[code].push(eachItem)
      else
        c2wResult[code] = [eachItem]
    }
    this.c2w = c2wResult
    return c2wResult
  }
}

export interface SchemaDictItem {
  words: string
  code: string
  line: number
}
