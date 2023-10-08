import { describe, expect, it } from 'vitest'
import { CollisionCalculator, UniqueTrieTree, getJisuCollision } from './uniqueTrieTree'
import { generateSegmentGreedily, segmentGreedily } from './segmentation'
import { SegmentAnalyser } from './segAnalysis'

export function addTestTree(i: string, tree: UniqueTrieTree) {
  i = i.trim()
  let lineno = 0
  for (const a of i.split('\n')) {
    lineno++
    const [words, codes] = a.trim().split(' ')
    tree.add(words, { code: codes, line: lineno, collision: 1, prefixeeLen: 0 })
  }
}

describe('通常情况下', () => {
  it('短码优先加词', () => {
    const u = new UniqueTrieTree()
    addTestTree(`
      好 abb
      好 aa`, u)
    expect(u.get('好')?.code).eq('aa')
  })

  it('行数最短优先加词', () => {
    const u = new UniqueTrieTree(true)
    addTestTree(`
      好 abb
      好 aa`, u)
    expect(u.get('好')?.code).eq('abb')
  })

  it('有空穴', () => {
    const u = new UniqueTrieTree(true)
    addTestTree(`
      海 a
      海上生明月 aaaa`, u)
    expect(u.get('海上')).eq(undefined)
    expect(u.data.get('海上')).toEqual({ code: '', collision: 0, line: 0, prefixeeLen: 5 })

    expect(u.data.get('海')).toEqual({ code: 'a', collision: 1, line: 1, prefixeeLen: 5 })
    u.delete('海')
    expect(u.data.get('海')).toEqual({ code: '', collision: 1, line: 1, prefixeeLen: 5 })

    u.delete('海上生明月')
    expect(u.data.get('海')).toMatchInlineSnapshot('undefined')
  })
})

describe('计算重码', () => {
  it('正常加词', () => {
    const c = new CollisionCalculator()
    expect(c.add('a')).toBe(1)
    expect(c.add('a')).toBe(2)
    c.delete('a')
    expect(c.get('a')).toBe(1)
    c.delete('a')
    expect(c.get('a')).toBe(0)
    c.delete('a')
    expect(c.get('a')).toBe(0)
  })
})

describe('极速赛码表的重码', () => {
  it('正常', () => {
    expect(getJisuCollision('').collision).toBe(1)
    expect(getJisuCollision('234').collision).toBe(234)
    expect(getJisuCollision('aaa234').collision).toBe(234)
    expect(getJisuCollision('aaa2_').collision).toBe(1)
  })
})

describe('贪婪分词', () => {
  const t = new UniqueTrieTree()
  addTestTree(`
好 a
好的 b
好好睡觉 C
睡觉 d
xo e`, t)
  it('只有汉字', () => {
    expect(segmentGreedily('好好的睡觉', t)).toMatchSnapshot()
  })
  it('含有英文', () => {
    expect(segmentGreedily('好xo觉bbbb', t)).toMatchSnapshot()
  })
  it('含有空格', () => {
    expect(segmentGreedily('好  好  ', t)).toMatchSnapshot()
  })
  it('含有标点', () => {
    expect(segmentGreedily('好的！', t)).toMatchSnapshot()
  })
  it('含有大写字母', () => {
    expect(segmentGreedily('好好睡觉！', t)).toMatchSnapshot()
  })
})

describe('贪婪分词生成器', () => {
  const t = new UniqueTrieTree()
  addTestTree(`
好 a
好的 b
好好睡觉 c
睡觉 d
xo e`, t)
  it('只有汉字', () => {
    expect([...generateSegmentGreedily('好好的睡觉', t)]).toMatchSnapshot()
  })
  it('含有英文', () => {
    expect([...generateSegmentGreedily('好xo觉bbbb', t)]).toMatchSnapshot()
  })
  it('含有空格', () => {
    expect([...generateSegmentGreedily('好  好  ', t)]).toMatchSnapshot()
  })
  it('含有标点', () => {
    expect([...generateSegmentGreedily('好的！', t)]).toMatchSnapshot()
  })
})

describe('分析', () => {
  const t = new UniqueTrieTree()
  addTestTree(`
好 a
好的 b
好好睡觉 c
睡觉 d
xo e`, t)
  const seg = [...generateSegmentGreedily('好觉b bbb睡觉24,', t)]
  it('常规', () => {
    expect(seg).toMatchSnapshot()
    const m = new SegmentAnalyser()

    seg.forEach((e) => {
      m.add(e)
    })
    expect(m.result).toMatchSnapshot()
  })
})
