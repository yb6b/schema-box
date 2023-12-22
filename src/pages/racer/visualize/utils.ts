import { findLastIndex, range } from 'remeda'

export function makeLabelAndDatas(
  rawDatas: number[][],
  suffix: string,
  firstItemName?: string,
): { data: number[][]; label: string[] } {
  let longestTruthyIndex = 0
  for (const data of rawDatas) {
    const lastTruthyIndex = findLastIndex(data, Boolean)
    if (lastTruthyIndex > longestTruthyIndex)
      longestTruthyIndex = lastTruthyIndex
  }
  const label = range(1, longestTruthyIndex + 1).map(v => `${v} ${suffix}`)
  if (firstItemName)
    label[0] = firstItemName
  return {
    label,
    data: rawDatas.map(v => v.slice(0, longestTruthyIndex)),
  }
}
