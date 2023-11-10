/**
 * @file 涉及字典树的存改
 * @author yb6b
 */

/**
 * 字典树中，每个词语的值。
 */
export interface TrieTreeValue {
  /** 编码。当编码为空，意味着是空穴前缀词 */
  code: string
  /** 重码数 */
  collision: number
  /** 码表文件行数 */
  line: number
  /**
   * 以该词为前缀的词条的最短字数，这是 `UniqueTrieTree` 维护的
   * 构建时手动设置为0
   */
  prefixeeLen: number
}

/**
 * 每个词条只保留一个编码的字典树
 */
export class UniqueTrieTree {
  constructor(
    private readonly shouldAddByLineNumber = false,
  ) { }

  // 主数据库
  public data: Map<string, TrieTreeValue> = new Map()

  /**
   * 查询获取词语的数据。空穴词当做undefined
   * @param words 词语
   * @returns 字典树里的数据
   */
  public get(words: string) {
    const r = this.data.get(words)
    if (r?.code)
      return r
    return undefined
  }

  /**
   * 加入一行词条。请确保数据的有效性！
   * @param words 词语
   * @param value 相关信息
   * @returns 是否正常添加进数据库
   */
  public add(words: string, value: TrieTreeValue): boolean {
    const oldValue = this.data.get(words)
    // 若词语重复了
    if (oldValue && oldValue.code) {
      // 先过滤无用的操作
      if (this.shouldAddByLineNumber) {
        if (oldValue.line < value.line)
          return false
      }
      else {
        if (oldValue.code.length <= value.code.length)
          return false
      }
      // 需要替代旧的
      value.prefixeeLen = oldValue.prefixeeLen
    }
    // 若词语不重复
    else {
      value.prefixeeLen = words.length
    }
    // 添加词语(复制了一遍)
    this.data.set(words, { ...value })
    // 添加前缀
    const wordsLength = words.length
    for (let i = 1; i < wordsLength; i++) {
      const prefixWords = words.slice(0, -i)
      const prefixValue = this.data.get(prefixWords)
      // 存在的前缀，修改其 prefixeeLen 值(变得更小)
      if (prefixValue) {
        prefixValue.prefixeeLen = wordsLength
        if (prefixValue.code) // 非穴词也改，之后退出循环
          break
      }
      // 前缀不存在，一定是空穴
      else {
        this.data.set(prefixWords, { code: '', line: 0, collision: 0, prefixeeLen: wordsLength })
      }
    }
    return true
  }

  /**
   * 删除数据库里的一条词
   * @param words 词语
   * @returns 是否真地改了数据
   */
  public delete(words: string): boolean {
    const oldValue = this.data.get(words)
    // 只处理已收录的词，并且不能是空穴
    if (oldValue && oldValue.code) {
      // 如果即是长词的前缀，也拥有短词前缀
      if (oldValue.prefixeeLen > words.length) {
        oldValue.code = '' // ① 当前词设为空穴

        // ② 准备修改前缀词中的 最短前缀长
        const newPrefixeeLen = oldValue.prefixeeLen
        for (let i = 1; i < words.length; i++) {
          const prefixWords = words.slice(0, -i)
          // 因为前缀词必然存在，所以关闭ts检查
          const prefixValue = this.data.get(prefixWords) as unknown as TrieTreeValue
          prefixValue.prefixeeLen = newPrefixeeLen
          // 直到非空穴词才结束
          if (oldValue.code)
            break
        }
      }
      // 如果词条不能成为前缀，所以要删除
      else {
        // ① 删除当前词
        this.data.delete(words)

        // ② 删除前缀
        for (let i = 1; i < words.length; i++) {
          const prefixWords = words.slice(0, -i)
          // 直到最长的词
          if (this.data.get(prefixWords)?.code)
            break
          else
            this.data.delete(prefixWords)
        }
      }
      return true
    }
    return false
  }
}

// 计算出 非极速赛码表 的重码
export class CollisionCalculator {
  private usedCodes: Map<string, number> = new Map()

  /**
   * 获取某个编码的选重数
   * @param code 编码
   * @returns 选重数，没有数据返回 0
   */
  public get(code: string) {
    return this.usedCodes.get(code) ?? 0
  }

  /**
   * 向数据库里添加一条编码
   * @param code 新的编码
   * @returns 当前编码的重码位
   */
  public add(code: string) {
    const oldCollision = this.usedCodes.get(code)
    const newCollision = oldCollision ? oldCollision + 1 : 1
    this.usedCodes.set(code, newCollision)
    return newCollision
  }

  /**
   * 从数据库里去除一则编码数据
   * @param code 要删一条编码
   * @returns 当前编码还剩的重码数，无数据则返回0
   */
  public delete(code: string) {
    const oldCollision = this.usedCodes.get(code)
    if (oldCollision) {
      if (oldCollision === 1) {
        this.usedCodes.delete(code)
        return 0
      }
      this.usedCodes.set(code, oldCollision - 1)
      return oldCollision - 1
    }
    return 0
  }
}

/**
 * 从极速赛码表的编码中，计算出重码
 * @param code 赛码表的编码
 * @returns 去除选重后的编码，以及重码数
 */
export function getJisuCollision(code: string): { code: string; collision: number } {
  // 空格是一重
  if (code[code.length - 1] === '_')
    return { code, collision: 1 }
  // 数字结尾的，有选重结果
  const pattern = /\d+$/
  const regexResult = pattern.exec(code)
  if (regexResult) {
    return {
      code: code.slice(0, regexResult.index),
      collision: Number.parseInt(regexResult[0]),
    }
  }
  // 没有尾缀的，也是一重
  return { code, collision: 1 }
}
