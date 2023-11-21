import type { SchemaDictItem } from '../../schema/index'

/**
 * 字典树中，每个词语的值。
 */
export interface TrieTreeValue {
  /** 重码数 */
  c: number
  /**
   * 以该词为前缀的词条的最短字数，这是 `UniqueTrieTree` 维护的
   * 新建时手动设置为0
   *
   */
  p: number
  /**
   * 包含编码、行号、词条信息,
   * 若是null,表示该记录是空穴
   * 手动添加时, 请勿设置为null
   */
  i: SchemaDictItem | null
}

/** 这种字典树里每个词条只保留一个编码 */
export type UniqueTrieTree = Map<string, TrieTreeValue>

/**
 * 获取字典树的值
 * 空穴词,或没有缺失的词,返回undefined
 */
export function treeGet(tree: UniqueTrieTree, words: string) {
  const r = tree.get(words)
  if (r?.i)
    return r
  return undefined
}

/**
 * 加入一条词,请确保数据有效.
 * 词条冲突时, 保留码长更短的
 * @param tree 添加到哪个字典树里？
 * @param item 添加哪个词条？
 * @param collision 这个词条的重码是几重？
 * @return 是否正常添加进字典树
 */
export function treeAddShortest(tree: UniqueTrieTree, item: SchemaDictItem, collision: number): boolean {
  const words = item.words
  const oldValue = tree.get(words)
  // 词条已经存在
  if (oldValue && oldValue.i) {
    if (oldValue.i.code.length <= item.code.length)
      // 码长更长则跳过
      return false
    oldValue.i = item
    oldValue.c = collision
    return true
  }
  // 词条不存在, 先添加其中
  tree.set(words, { i: item, c: collision, p: 0 })
  // 添加前缀
  const wordsLength = words.length
  for (let i = 1; i < wordsLength; i++) {
    const prefixWords = words.slice(0, -i)
    const prefixValue = tree.get(prefixWords)
    // 前缀存在，修改其 prefixeeLen 值(变得更小)
    if (prefixValue) {
      prefixValue.p = wordsLength
      if (prefixValue.i)
        return true
    }
    // 前缀不存在，该前缀一定是空穴
    else {
      tree.set(prefixWords, { i: null, c: 0, p: wordsLength })
    }
  }
  return true
}

/**
 * 加入一条词,请确保数据有效.
 * 词条冲突时, 只保留后添加的. 通常也是行号靠后的
 * @param tree 添加到哪个字典树里？
 * @param item 添加哪个词条？
 * @param collision 这个词条的重码是几重？
 * @return 是否正常添加进字典树
 */
export function treeAddLatest(tree: UniqueTrieTree, item: SchemaDictItem, collision: number): boolean {
  const words = item.words
  const oldValue = tree.get(words)
  // 词条已经存在, 也不是空穴
  if (oldValue && oldValue.i) {
    // 不管如何,直接添加
    oldValue.i = item
    oldValue.c = collision
    return true
  }
  // 词条不存在, 先添加其中
  tree.set(words, { i: item, c: collision, p: 0 })
  // 添加前缀
  const wordsLength = words.length
  for (let i = 1; i < wordsLength; i++) {
    const prefixWords = words.slice(0, -i)
    const prefixValue = tree.get(prefixWords)
    // 前缀存在，修改其 prefixeeLen 值(变得更小)
    if (prefixValue) {
      prefixValue.p = wordsLength
      if (prefixValue.i)
        return true
    }
    // 前缀不存在，该前缀一定是空穴
    else {
      tree.set(prefixWords, { i: null, c: 0, p: wordsLength })
    }
  }
  return true
}

/**
 * 删除数据库里的一条词
 * @param tree 从哪个字典树里删除词条
 * @param words 词语
 * @returns 是否真地改了数据
 */
export function treeDelete(tree: UniqueTrieTree, words: string): boolean {
  const oldValue = tree.get(words)
  // 已收录的词，且不是空穴
  if (oldValue && oldValue.i) {
    // 字典树里,既有更长的词,又有更短的词
    if (oldValue.p > words.length) {
      // ① 当前词设为空穴
      oldValue.i = null
      // ② 修改短词中的 最短前缀长
      const newPrefixeeLen = oldValue.p
      for (let i = 1; i < words.length; i++) {
        const prefixWords = words.slice(0, -i)
        // 因为前缀词必然存在，所以关闭ts检查
        const prefixValue = tree.get(prefixWords)
        if (!prefixValue)
          continue
        prefixValue.p = newPrefixeeLen
        // 直到非空穴词才结束
        if (prefixValue.i)
          return true
      }
    }
    // 如果没有更长的词,删除它和它的空穴前缀
    else {
      // ① 删除当前词
      tree.delete(words)
      // ② 删除前缀
      for (let i = 1; i < words.length; i++) {
        const prefixWords = words.slice(0, -i)
        // 直到非空穴
        if (tree.get(prefixWords)?.i)
          return true
        else
          tree.delete(prefixWords)
      }
    }
    return true
  }
  // 未收录的词,或空穴,结束
  return false
}
