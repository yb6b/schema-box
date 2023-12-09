import { findLastIndex } from 'remeda'

export function dropLastFalsyItems(arr: Array<any>) {
  const lastTruthyItemIndex = findLastIndex(arr, Boolean)
  return arr.slice(0, lastTruthyItemIndex + 1)
}
