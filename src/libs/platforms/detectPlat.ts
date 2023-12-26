import type { Mabiao } from '../schema'
import { createEmptyMabiao, detectSellectKeys, keysSet, maxCodeLen } from '../schema'
import type { RawFile } from './rawFile'
import type { PlatTypes } from './index'
import {
  FormatError,
  detectPlatAuto,
  dumpPlatDuoduo,
  dumpPlatRime,
  dumpPlatYong,
  loadPlatAuto,
  loadPlatDuoduo,
  loadPlatRime,
  loadPlatYong,
  validatePlatDuoduo,
  validatePlatRime,
  validatePlatYong,
} from './index'

type PlatTypesWithoutAuto = Exclude<PlatTypes, 'auto'>

/**
 * 自动识别各种平台的格式
 * @returns 相应的平台名称, 如果找不到, 返回null
 */
export async function detectPlatform(raw: RawFile) {
  const validateFunc: [typeof validatePlatRime, PlatTypesWithoutAuto][] = [
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
export const platToLoader: Record<PlatTypesWithoutAuto, (raw: RawFile) => Promise<Mabiao>> = {
  duoduo: loadPlatDuoduo,
  rime: loadPlatRime,
  yong: loadPlatYong,
}

export const platToDump: Record<PlatTypesWithoutAuto, (mb: Mabiao) => string> = {
  duoduo: dumpPlatDuoduo,
  rime: dumpPlatRime,
  yong: dumpPlatYong,
}

export const platToName: Record<PlatTypes, string> = {
  auto: '通用格式',
  rime: 'Rime',
  duoduo: '多多',
  yong: '小小',
}

/** 推测格式, 补全选重、码长等信息 */
export async function detectAndFillMabiao(raw: RawFile) {
  let mb = createEmptyMabiao()
  const plat = await detectPlatform(raw)
  if (plat === null) {
    // 没有找到码表, 则试试 auto
    const fmt = await detectPlatAuto(raw)
    if (fmt === null)
      throw new FormatError(`无法分析出 ${raw.name} 的格式`)
    mb = await loadPlatAuto(raw, fmt)
  }
  else {
    const loader = platToLoader[plat]
    mb = await loader(raw)
  }
  // 有了码表之后, 推断各项数据
  mb.maxCodeLen = maxCodeLen(mb.items)
  mb.cmLen = mb.cmLen ?? mb.maxCodeLen
  mb.selectKeys = detectSellectKeys(keysSet(mb.items))
  mb.raw = raw // 防错
  return mb
}
