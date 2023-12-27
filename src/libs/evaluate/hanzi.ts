/**
 * 根据字频表数据测评, 即科学形码测评系统
 */

import type { Mabiao, MabiaoItem } from '../schema'

export const presetHanziFreq = (await import('./hanziFreq')).default

/** 获取字频数据 */
export function parse() {

}

/** 提取码表中的出简不出全单字码表 */
export function purifyMabiao(mb: Mabiao) {
  const hanziMap = new Map<string, MabiaoItem>()
  for (const e of mb.items) {
    if (e[0].length > 1)
      continue
  }
}

/** 测评5个区间 */

/** 测评2个合计 */

/** 测评2个加权行 */
