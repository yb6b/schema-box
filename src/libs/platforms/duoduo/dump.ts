/**
 * 多多平台，内部格式转文本对象。
 */
import type { DumpSchema } from '../platformTypes'
import { createTextBlob } from '../utils'

export const dumpDuoduo: DumpSchema = (src) => {
  let result = ''
  for (const item of src.dicts[0].items)
    result += `${item.words}\t${item.code}\n`
  return createTextBlob(result)
}
