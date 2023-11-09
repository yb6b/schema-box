import type { RawFileData } from '../platforms/platformTypes'

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
    this.mainDict = this.dicts[0]
  }

  dicts: SchemaDict[]
  /** 配置文件的原始文件 */
  raw?: RawFileData
  /** 方案的名称 */
  name?: string
  author?: string
  description?: string
  /** 选重键 */
  selectKeys?: string
  /** 上屏码长 */
  commitLength?: number
  /** 平台相关的其他信息 */
  meta?: Record<string, unknown>

  /** 默认码表 */
  mainDict: SchemaDict
  pushMainDict(item: SchemaDictItem) {
    return this.mainDict.items.push(item)
  }
}

export class SchemaDict {
  constructor() {}
  /** 按码表顺序的每个词条 */
  items: SchemaDictItem[] = []
  /** 码表的原始文件 */
  raw?: RawFileData
  /**
   * 编码 - 候选词语的列表
   * 修改items后，清空它
   */
  c2w?: Record<string, SchemaDictItem[]>
  /** 平台相关的其他信息 */
  meta?: Record<string, unknown>

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
  meta?: Record<string, unknown>
}
