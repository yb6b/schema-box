import { mapValues } from 'remeda'

export function totalFreq(usage: Record<string, number>) {
  let rs = 0
  for (const freq of Object.values(usage))
    rs += freq
  return rs
}

/** 把频数映射转换成频率映射 */
export function freqToRelativeFreq(map: Record<string, number>) {
  const total_freq = totalFreq(map)
  return mapValues(map, freq => freq / total_freq)
}

/** 两个集合的交集 */
export function intersectionBetweenSets<T extends Set<string | number | bigint>>(setA: T, setB: T): T {
  const rs = new Set() as T
  for (const k of setA.keys()) {
    if (setB.has(k))
      rs.add(k)
  }
  return rs
}

/** 把一个对象的键转成Set */
export function objectKeysToSet(obj: object) {
  return new Set(Object.keys(obj))
}

/** 取出对象里的元素 */
export function pickObject<T extends object>(obj: T, keys: Iterable<string | number | symbol>): T {
  const rs = {} as T
  for (const e of keys)
  // @ts-expect-error magic
    rs[e] = obj[e]
  return rs
}

function mergeObjectToBase(base: object, other: object) {
  for (const [k, v] of Object.entries(other)) {
    if (Array.isArray(v)) {
      // @ts-expect-error magic
      base[k] = base[k].concat(v)
    }
    else if (typeof v === 'number') {
      if (k in base)
      // @ts-expect-error magic
        base[k] += v
      else
      // @ts-expect-error magic
        base[k] = v
    }
    // 对象
    else {
      // @ts-expect-error magic
      mergeObjectToBase(base[k], v)
    }
  }
}

/** 合并多个对象 */
export function zipObjects<T extends object>(obj_arr: T[]): T {
  const len = obj_arr.length
  if (len === 0)
    throw new Error(`参数${obj_arr}为空列表`)

  const rs = structuredClone(obj_arr[0])
  if (len === 1)
    return rs

  for (let i = 1; i < len; i++) {
    const e = obj_arr[i]
    mergeObjectToBase(rs, e)
  }
  return rs
}
