export type SchemaTypes = 'Duoduo' | 'rime' | 'yong' | 'jisu'

export interface Schema {
  /** 码表的数据 */
  dict: SchemaDict
  /** 码表的配置参数 */
  options?: SchemaOptions
}

export type SchemaDict = {
  /** 词语 */
  words: string
  /** 编码 */
  code: string
  /** 行数 */
  line: number
  /** 辅助信息 */
  meta?: {
    [etc: string]: unknown
  }
}[]

export interface SchemaOptions {
  /** 原始文件名 */
  src?: string
  /** 原始文件的码表格式 */
  srcFormat?: string
  /** 方案的名称 */
  name?: string
  /** 方案的作者 */
  author?: string
  /** 方案的简介 */
  description?: string
  /** 选重键 */
  selectKeys?: string
  /** 上屏码长 */
  commitLength?: number
}

// 字符串转成默认的格式
export interface LoadSchemaFunction {
  (src: string): Schema
}

// 默认码表数据 转回 字符串
export interface DumpSchemaFunction {
  (src: Schema): string
}

// 推测码表的类型
export interface DetectSchemaFormat {
  (src: string): SchemaTypes
}

export class FormatError extends Error {

}
