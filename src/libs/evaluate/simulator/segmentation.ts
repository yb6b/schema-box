/**
 * @file 按照字典树，拆分文章成一条条词语
 * @author yb6b
 */

import { PUNCTUATIONS } from '../../schema/keys'
import type { TrieTreeValue, UniqueTrieTree } from './unique-trie-tree'

/**
 * 按照字典树切文章，要预处理文章中的控制字符
 */
export class Segment {
  constructor(
    public tree: UniqueTrieTree,
    public article: string,
  ) { }

  /** 把结果转换成对象，在在matchNext之后执行，不会检查有没有全部分析完 */
  collect(): SegValue {
    switch (this.type) {
      case 1:
        return { type: 1, value: this.ttv! }
      case 5:
        return { type: 5, words: this.bw! }
      default:
        return { type: this.type, words: this.bw!, code: this.bc! }
    }
  }

  index = 0
  /**
   * 匹配下一个。如果要重新开始，手动设置 this.index=0
   * @returns 如果是-1 则全文匹配结束
   */
  next() {
    const i = this.index

    // 已经结尾了，跳过
    if (i >= this.article.length)
      return -1

    // 是不是字典树里的
    if (this.mTT(i)) {
      this.type = 1
      return this.index += this.ttv!.i![0].length
    }

    // 是不是中文标点符号
    if (this.mPunc(i)) {
      this.type = 2
      return this.index += this.bw!.length
    }
    // 是不是英文标点符号
    if (this.mBD(i, PUNCTUATIONS.en)) {
      this.type = 3
      return this.index += this.bw!.length
    }

    // 是不是中英文通用的标点符号
    if (this.mBD(i, PUNCTUATIONS.uni)) {
      this.type = 4
      return this.index += this.bw!.length
    }

    // 都不是，那只能是缺字
    this.bw = String.fromCodePoint(this.article.codePointAt(i)!) // 要考虑双字的unicode
    this.type = 5
    return this.index += this.bw.length
  }

  /**
   * 临时切片的类型：
   * 1. 码表的字词
   * 2. 中文标点
   * 3. 英文和英文标点
   * 4. 无论中英文都能打出的标点
   * 5. 缺字
   */
  type: SegValue['type'] = 1
  /** 临时的最佳词条 */
  bw?: string
  /** 临时的最佳编码 */
  bc?: string
  /** 临时的字典树 */
  ttv?: TrieTreeValue

  /** 预处理 */
  private pre() {
    if (this.article.includes('　'/* 全角空格 */))
      this.article = this.article.replace('　', '')
  }

  /**
   * match trie tree
   * 从文章的特定索引号开始, 找到最佳匹配的字典树的词.
   * 找到的最佳匹配会放在this.ttv里
   * @return 能否匹配到
   */
  private mTT(index: number): boolean {
    const article = this.article
    const maxIndex = article.length
    let wd = article[index]
    let alreadyHadResult = false

    for (let i = index; i <= maxIndex;) {
      const ttvalue = this.tree.get(wd)
      // 未收录
      if (!ttvalue)
        return alreadyHadResult

      // 收录了空穴，唯一的可能：第一个字是空穴。
      if (!ttvalue.i) {
        i = index + ttvalue.p
        wd = article.slice(index, i)
        continue
      }

      // 收录的不是这个词
      if (ttvalue.i[0] !== wd)
        return alreadyHadResult

      // 是这个词，而且正好最长匹配
      if (wd.length === ttvalue.p) {
        this.ttv = ttvalue
        return true
      }

      // 是这个词，但提示还有更长的。
      alreadyHadResult = true
      this.ttv = ttvalue
      i = index + ttvalue.p
      wd = article.slice(index, i)
    }
    // 到了最后,却不是最长匹配
    return alreadyHadResult
  }

  /**
   * match punctuation
   * 从指定索引号开始, 找到下一个中文标点符号
   * 最佳匹配会放在this.bc this.bw里
   * @return 能不能匹配到
   */
  private mPunc(index: number): boolean {
    const dict = PUNCTUATIONS.cn
    let wd = this.article[index]
    let punc = dict[wd]
    if (!punc)
      return false
    // 处理两个字的标点
    if (punc === '…' || punc === '—') {
      if (punc === this.article[index + 1]) {
        wd += wd
        punc = dict[wd]
        if (!punc)
          return false
      }
    }
    this.bw = wd
    this.bc = punc
    return true
  }

  /**
   * match by dict
   * 用于找到下一组英文或通用符号
   * 最佳匹配会放在this.bc this.bw里
   * @return 能不能匹配到
   */
  private mBD(index: number, dict: Record<string, string>) {
    let alreadyHadResult = false
    const len = this.article.length
    let c = ''
    let w = ''
    for (let i = index; i < len; i++) {
      const wd = this.article[i]
      const code = dict[wd]
      if (!code)
        return alreadyHadResult
      alreadyHadResult = true
      c += code
      w += wd
      this.bc = c
      this.bw = w
    }
    // 到结尾都是符号
    return true
  }
}

interface SegValueCn {
  type: 1
  value: TrieTreeValue
}

interface SegValuePunc {
  type: 2
  words: string
  code: string
}

interface SegValueEn {
  type: 3
  words: string
  code: string
}

interface SegValueUni {
  type: 4
  words: string
  code: string
}

interface SegValueLack {
  type: 5
  words: string
}

export type SegValue = SegValueCn | SegValueEn | SegValueLack | SegValuePunc | SegValueUni
