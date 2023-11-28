import type { Schema } from '../schema'
import type RawFile from './rawFile'

export * from '../schema'

export type Platforms = 'duoduo' | 'yong' | 'rime'

export interface LoadSchema {
  (src: RawFile): Promise<Schema>
}

// 默认码表数据 转回 字符串
export interface DumpSchema {
  (src: Schema): Blob
}

// 推测码表的类型
export interface ValidateSchema {
  (src: RawFile): Promise<boolean>
}

export class FormatError extends Error {}
