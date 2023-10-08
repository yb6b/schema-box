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
 * 预览文章的内容
 */
export function previewArticle(article: string): string {
  if (article.length < 120)
    return article

  const r = article.match(/^(.{30}).*(.{10})$/su)
  if (r)
    return `${r[1]}\n……\n${r[2]}`

  return article
}

/**
 * 处理字符串里的每行
 */
export function handleEachLine(src: string, handler: (eachLine: string) => void) {
  const lineBreakerPattern = /\r?\n|\r/g
  let last = 0
  let match = lineBreakerPattern.exec(src)
  while (match) {
    handler(src.slice(last, match.index))
    last = match.index + match[0].length
    match = lineBreakerPattern.exec(src)
  }
  handler(src.slice(last))
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

export function setTitle(title: string, suffix = ' · 形码盒子') {
  document.title = `${title}${suffix}`
}
