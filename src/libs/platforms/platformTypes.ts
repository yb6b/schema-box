import type { Schema } from '../schema'
import type RawFile from './rawFile'

export * from '../schema'

export class FormatError extends Error {}

export interface Platform {
  id: string
  /** 读取码表 */
  load(raw: RawFile): Promise<Schema>
  /** 转换成码表 */
  dump(schema: Schema): string
  /** 转换成blob格式 */
  dumpBlob?: (schema: Schema) => Blob
  /** 快速粗糙地验证是不是某格式 */
  validate(raw: RawFile): Promise<boolean>
}
