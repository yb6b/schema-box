import { customAlphabet } from 'nanoid'

export const nanoid6 = customAlphabet('346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz', 6)
async function customFetch<T>(url: string, handler: (f: Response) => Promise<T>) {
  const f = await fetch(url)
  if (f.ok)
    return handler(f)
  throw new Error(`无法下载${url}文件`)
}

export async function fetchText(url: string, encoding = 'utf-8') {
  if (encoding === 'utf-8')
    return await customFetch(url, async r => r.text())

  return await customFetch(url, async (r) => {
    const b = await r.blob()
    const reader = new FileReader()
    reader.readAsText(b, encoding)
    return reader.result
  })
}

export async function fetchJson(url: string) {
  return await customFetch(url, r => r.json())
}

/**
 * 生成反向索引
 * @param i 可迭代的流数据，元素必须是数字或字符串
 * @returns 元素到索引的Map
 */
export function createWantIndex<T>(i: Iterable<T>) {
  return new Map([...i].map((v, ii) => [v, ii]))
}

const _cacheStore = new Map()

/**
 * 缓存一个值
 */
export function Cache(name: string, value: any) {
  if (!_cacheStore.has(name))
    _cacheStore.set(name, value)
  return value
}

/** 给定函数的函数代码，常用于new Function的特殊性能优化之中 */
export function functionBody(fn: Function) {
  const str = fn.toString()
  return str.slice(
    str.indexOf('{') + 1,
    str.lastIndexOf('}'),
  )
}
