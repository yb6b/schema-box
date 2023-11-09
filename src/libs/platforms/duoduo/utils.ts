import { checkCodes } from '../utils'

interface DuoduoCodesInfo {
  codes: string
  meta: {
    order?: number
    kind?: number
    fix?: boolean
    user?: boolean
    secondary?: boolean
    support?: boolean
  }
}

export function parseDuoduoCodes(src: string): DuoduoCodesInfo {
  const S = src.trim()
  if (!S.includes('#'))
    return { codes: checkCodes(S), meta: {} }

  const srcSplit = src.trim().split('#')
  const result: DuoduoCodesInfo = { codes: checkCodes(srcSplit[0]), meta: {} }
  for (let i = 1; i < srcSplit.length; i++) {
    const element = srcSplit[i]
    switch (element[0]) {
      case '序':
        result.meta.order = Number.parseInt(element.slice(1)); break
      case '类':
        result.meta.kind = Number.parseInt(element.slice(1)); break
      case '次':
        result.meta.secondary = true; break
      case '辅':
        result.meta.support = true; break
      case '用':
        result.meta.user = true; break
      case '固':
        result.meta.fix = true; break
      default:
        throw new TypeError(`无法分析编码「${src}」中的「#${element}」`)
    }
  }
  return result
}
