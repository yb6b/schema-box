import type { RawFile } from '../platforms/raw-file'
import type { Mabiao } from './mabiao'

export interface Schema {
  // dicts: Mabiao[]
  cfg: SchemaConfig
  meta?: unknown
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
