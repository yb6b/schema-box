import { fetchJson } from 'libs/utils'


interface ArticlePresetInfo {
  name: string
  length: number
  file: string
}

interface DictPresetInfo {
  name: string
  template: string
  line: number
  file: string
}

function completeArticleUrl(file: string) {
  return `${process.env.VUE_ROUTER_BASE}/presets/articles/${file}`
}

function completeSchemaUrl(file: string) {
  return `${process.env.VUE_ROUTER_BASE}/presets/schemas/${file}`
}

export async function getArticleMenu(): Promise<ArticlePresetInfo[]> {
  return await fetchJson(completeArticleUrl('menu.json'))
}
export async function getSchemaMenu(): Promise<DictPresetInfo[]> {
  return await fetchJson(completeSchemaUrl('menu.json'))
}
