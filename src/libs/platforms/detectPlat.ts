import type { RawFile } from './rawFile'
import type { PlatTypes } from './index'
import { validatePlatDuoduo, validatePlatRime, validatePlatYong } from './index'

/**
 * 自动识别各种平台的格式
 * @returns 相应的平台名称, 如果找不到, 返回null
 */
export async function detectPlatform(raw: RawFile) {
  const validateFunc: [typeof validatePlatRime, PlatTypes][] = [
    [validatePlatDuoduo, 'duoduo'],
    [validatePlatRime, 'rime'],
    [validatePlatYong, 'yong'],
  ]

  for (const [fn, name] of validateFunc) {
    try {
      const r = await fn(raw)
      if (r)
        return name
    }
    catch (error) {
      continue
    }
  }
  return null
}
