/**
 * @file 按照字典树，拆分文章成一条条词语
 * @author yb6b
 */

import { PUNCTUATIONS } from '../schema/keys'
import type { TrieTreeValue, UniqueTrieTree } from './uniqueTrieTree'

interface SegValueCn {
  type: 'c'
  index: number
  words: string
  value: TrieTreeValue
}

interface SegValuePunc {
  type: 'p'
  index: number
  words: string
  code: string
}

interface SegValueEn {
  type: 'e'
  index: number
  words: string
  code: string
}

interface SegValueUni {
  type: 'u'
  index: number
  words: string
  code: string
}

interface SegValueLack {
  type: 'l'
  index: number
  words: string
}

export type SegValue = SegValueCn | SegValueEn | SegValueLack | SegValuePunc | SegValueUni

/**
 * 用贪婪算法拆分文章。优先用最长的词匹配。
 * @param src 要分词的文章，请确保文章不是空字符串
 * @param tree 方案的字典树
 */
export function segmentGreedily(src: string, tree: UniqueTrieTree): SegValue[] {
  const maxIndex = src.length - 1
  const result: SegValue[] = []
  let beginIndex = 0
  let endIndex = 0
  let bestWords: string
  let bestValue: TrieTreeValue

  const maybeSignalButZh = () => {
    const getCode = (dict: any) => {
      const ei = endIndex
      const bi = beginIndex
      const d = dict
      const tmpResult: string[] = new Array(ei - bi)
      for (let i = bi; i < ei; i++)
        tmpResult[i - bi] = d[src[i]]
      return tmpResult.join('')
    }
    const twoLetterPunctuation = (punc: string) => {
      const puncCode = PUNCTUATIONS.cn[punc]
      if (src[beginIndex + 1] === punc) {
        result.push({ type: 'p', words: punc + punc, index: beginIndex, code: puncCode + puncCode })
        beginIndex += 2
      }
      else {
        result.push({ type: 'p', words: punc, index: beginIndex, code: puncCode })
        beginIndex += 1
      }
    }
    const firstWord = src[beginIndex]
    endIndex = beginIndex
    // 是中文标点？
    if (firstWord in PUNCTUATIONS.cn) {
      switch (firstWord) {
        case '…': twoLetterPunctuation('…')
          break
        case '—': twoLetterPunctuation('—')
          break
        default:result.push({ type: 'p', words: firstWord, index: beginIndex, code: PUNCTUATIONS.cn[firstWord] })
          beginIndex++
          break
      }
    }
    // 中英通用的标点？
    else if (firstWord in PUNCTUATIONS.uni) {
      while (src[endIndex] in PUNCTUATIONS.uni && endIndex <= maxIndex) endIndex++
      result.push({ type: 'u', index: beginIndex, words: src.slice(beginIndex, endIndex), code: getCode(PUNCTUATIONS.uni) })
      beginIndex = endIndex
    }
    // 英文符号？
    else if (firstWord in PUNCTUATIONS.en) {
      while (src[endIndex] in PUNCTUATIONS.en && endIndex <= maxIndex) endIndex++
      result.push({ type: 'e', index: beginIndex, words: src.slice(beginIndex, endIndex), code: getCode(PUNCTUATIONS.en) })
      beginIndex = endIndex
    }
    // 只能是缺字了
    else {
      result.push({ type: 'l', words: firstWord, index: beginIndex })
      beginIndex += firstWord.length
    }
  }
  // 如果第一轮就挂了，需要best*数据回退
  const scanTree = () => {
    // 先处理第一次运行
    while (true) {
      // 到文末
      if (maxIndex < endIndex) {
        result.push({ type: 'c', index: beginIndex, words: bestWords, value: bestValue })
        beginIndex += bestWords.length
        return
      }
      const tmpWords = src.slice(beginIndex, endIndex)
      const tmpValue = tree.data.get(tmpWords)
      if (tmpValue) {
        // 到最长
        if (tmpValue.prefixeeLen === tmpWords.length) {
          result.push({ type: 'c', index: beginIndex, words: tmpWords, value: tmpValue })
          beginIndex = endIndex
          return
        }
        // 否则仍需要迭代，用几个 best* 暂存结果
        bestWords = tmpWords
        bestValue = tmpValue
        endIndex = beginIndex + tmpValue.prefixeeLen
      }
      // 找不到了
      else {
        result.push({ type: 'c', index: beginIndex, words: bestWords, value: bestValue })
        beginIndex += bestWords.length
        return
      }
    }
  }

  // 每次循环生成添加一个 Seg
  do {
    const firstWord = String.fromCodePoint(src.codePointAt(beginIndex) as number)
    const firstWordValue = tree.data.get(firstWord)
    if (firstWordValue) {
      // 数据库里只收录了该单字，不可能是空穴
      if (firstWord.length === firstWordValue.prefixeeLen) {
        result.push({ type: 'c', index: beginIndex, words: firstWord, value: firstWordValue })
        beginIndex += firstWord.length
        continue
      }

      bestValue = firstWordValue
      bestWords = firstWord
      endIndex = beginIndex + firstWordValue.prefixeeLen

      // 第一个字不是空穴
      if (firstWordValue.code) {
        scanTree()
      }
      // 第一个字是空穴
      else {
        const secondWord = src.slice(beginIndex, endIndex)
        const secondWordValue = tree.data.get(secondWord)
        // 能匹配更长的，必然不是空首字
        if (secondWordValue) {
          // 数据库里只收录了词，不可能是空穴
          if (secondWord.length === secondWordValue.prefixeeLen) {
            result.push({ type: 'c', index: beginIndex, words: secondWord, value: secondWordValue })
            beginIndex += secondWord.length
            continue
          }
          bestWords = secondWord
          bestValue = secondWordValue
          endIndex = beginIndex + secondWordValue.prefixeeLen
          scanTree()
        }
        // 首字是空的，有可能是标点等
        else {
          maybeSignalButZh()
        }
      }
    }
    // 未收录或空穴的，是缺字或别的情况
    else {
      maybeSignalButZh()
    }
  } while (beginIndex <= maxIndex)

  return result
}

export function* generateSegmentGreedily(src: string, tree: UniqueTrieTree) {
  const maxIndex = src.length - 1
  let beginIndex = 0
  let endIndex = 0
  let bestWords: string
  let bestValue: TrieTreeValue

  // 每次循环生成添加一个 Seg
  do {
    const firstWord = String.fromCodePoint(src.codePointAt(beginIndex) as number)
    const firstWordValue = tree.data.get(firstWord)
    if (firstWordValue) {
      // 数据库里只收录了该单字，不可能是空穴
      if (firstWord.length === firstWordValue.prefixeeLen) {
        yield { type: 'c', index: beginIndex, words: firstWord, value: firstWordValue } as SegValueCn
        beginIndex += firstWord.length
        continue
      }

      bestValue = firstWordValue
      bestWords = firstWord
      endIndex = beginIndex + firstWordValue.prefixeeLen

      // 第一个字不是空穴
      if (firstWordValue.code) {
        yield scanTree()
      }
      // 第一个字是空穴
      else {
        const secondWord = src.slice(beginIndex, endIndex)
        const secondWordValue = tree.data.get(secondWord)
        // 能匹配更长的，必然不是空首字
        if (secondWordValue) {
          // 数据库里只收录了词，不可能是空穴
          if (secondWord.length === secondWordValue.prefixeeLen) {
            yield { type: 'c', index: beginIndex, words: secondWord, value: secondWordValue } as SegValueCn
            beginIndex += secondWord.length
            continue
          }
          bestWords = secondWord
          bestValue = secondWordValue
          endIndex = beginIndex + secondWordValue.prefixeeLen
          yield scanTree()
        }
        // 首字是空的，有可能是标点等
        else {
          yield maybeSignalButZh()
        }
      }
    }
    // 未收录或空穴的，是缺字或别的情况
    else {
      yield maybeSignalButZh()
    }
  } while (beginIndex <= maxIndex)

  function maybeSignalButZh(): SegValue {
    const getCode = (dict: any) => {
      const ei = endIndex
      const bi = beginIndex
      const d = dict
      const tmpResult: string[] = new Array(ei - bi)
      for (let i = bi; i < ei; i++)
        tmpResult[i - bi] = d[src[i]]
      return tmpResult.join('')
    }
    const twoLetterPunctuation = (punc: string): SegValuePunc => {
      const puncCode = PUNCTUATIONS.cn[punc]
      if (src[beginIndex + 1] === punc) {
        const tmp: SegValuePunc = { type: 'p', words: punc + punc, index: beginIndex, code: puncCode + puncCode }
        beginIndex += 2
        return tmp
      }
      else {
        const tmp: SegValuePunc = { type: 'p', words: punc, index: beginIndex, code: puncCode }
        beginIndex += 1
        return tmp
      }
    }
    let tmp: SegValue
    const firstWord = src[beginIndex]
    endIndex = beginIndex
    // 是中文标点？
    if (firstWord in PUNCTUATIONS.cn) {
      switch (firstWord) {
        case '…': return twoLetterPunctuation('…')
        case '—': return twoLetterPunctuation('—')
        default: tmp = { type: 'p', words: firstWord, index: beginIndex, code: PUNCTUATIONS.cn[firstWord] }
          beginIndex++
      }
    }
    // 中英通用的标点？
    else if (firstWord in PUNCTUATIONS.uni) {
      while (src[endIndex] in PUNCTUATIONS.uni && endIndex <= maxIndex) endIndex++

      tmp = { type: 'u', index: beginIndex, words: src.slice(beginIndex, endIndex), code: getCode(PUNCTUATIONS.uni) }
      beginIndex = endIndex
    }
    // 英文符号？
    else if (firstWord in PUNCTUATIONS.en) {
      while (src[endIndex] in PUNCTUATIONS.en && endIndex <= maxIndex) endIndex++
      tmp = { type: 'e', index: beginIndex, words: src.slice(beginIndex, endIndex), code: getCode(PUNCTUATIONS.en) }
      beginIndex = endIndex
    }
    // 只能是缺字了
    else {
      tmp = { type: 'l', words: firstWord, index: beginIndex }
      beginIndex += firstWord.length
    }
    return tmp
  }

  // 如果第一轮就挂了，需要best*数据回退
  function scanTree() {
    // 先处理第一次运行
    while (true) {
      let tmp: SegValue
      // 到文末
      if (maxIndex < endIndex) {
        tmp = { type: 'c', index: beginIndex, words: bestWords, value: bestValue }
        beginIndex += bestWords.length
        return tmp
      }
      const tmpWords = src.slice(beginIndex, endIndex)
      const tmpValue = tree.data.get(tmpWords)
      if (tmpValue) {
        // 到最长
        if (tmpValue.prefixeeLen === tmpWords.length) {
          tmp = { type: 'c', index: beginIndex, words: tmpWords, value: tmpValue }
          beginIndex = endIndex
          return tmp
        }
        // 否则仍需要迭代，用几个 best* 暂存结果
        bestWords = tmpWords
        bestValue = tmpValue
        endIndex = beginIndex + tmpValue.prefixeeLen
      }
      // 找不到了
      else {
        tmp = { type: 'c', index: beginIndex, words: bestWords, value: bestValue }
        beginIndex += bestWords.length
        return tmp
      }
    }
  }
}
