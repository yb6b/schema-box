/**
 * 获取码表的数据
 */
import type { Mabiao, MabiaoItem } from '@/libs/schema'
import { getCodeToWordsDict } from '@/libs/schema'
import { isOneChar } from '@/libs/utils'

export function isHanzi(wd: string) {
  const re = /\p{Ideo}/gu
  return re.test(wd)
}

export function getSingleHanziSet(mb: Mabiao) {
  const rs = new Set<string>()
  for (const [wd] of mb.items) {
    if (isOneChar(wd) && isHanzi(wd))
      rs.add(wd)
  }
  return rs
}

/** 码表中有重码的词条 */
export function getCollisionCollection(mb: Mabiao) {
  const CTW = getCodeToWordsDict(mb)
  const rs: MabiaoItem<object>[][] = []
  for (const e of CTW.values()) {
    if (e.length < 2)
      continue
    rs.push(e)
  }
  return rs
}
