import type { MabiaoItem } from 'libs/schema'
import { Segment } from './segmentation'
import { createTree, treeAdd } from './uniqueTrieTree'

const v: MabiaoItem[] = [
  ['不', 'aa', 1],
  ['不是是', 'aa bB', 2],
  ['是', 'b', 3],
  ['$', 's', 4],
  ['￥', 's', 5],
  ['\n', 's', 5],
]

const tree = createTree()
v.forEach(v => treeAdd(tree, v, 1))

describe('分词', () => {
  it('正常', () => {
    const s = new Segment(tree, '不是是是不')
    exNextAndCollectTT(s, 3, '不是是')
    exNextAndCollectTT(s, 4, '是')
    exNextAndCollectTT(s, 5, '不')
    exNextAndCollectTT(s, -1, '不')
  })

  it('缺词', () => {
    const s = new Segment(tree, '不会')
    exNextAndCollectTT(s, 1, '不')
    expect(s.next()).toBe(2)
    expect(s.collect()).toStrictEqual({ type: 5, words: '会' })
    expect(s.next()).toBe(-1)
  })

  it('码表里的标点', () => {
    const s = new Segment(tree, '$\n￥')
    exNextAndCollectTT(s, 1, '$')
    exNextAndCollectTT(s, 2, '\n')
    exNextAndCollectTT(s, 3, '￥')
  })

  it('各种标点符号', () => {
    const s = new Segment(tree, ',.\t，。')
    expect(s.next()).toBe(2)
    expect(s.collect()).toStrictEqual({ type: 3, words: ',.', code: ',.' })
    expect(s.next()).toBe(3)
    expect(s.collect()).toStrictEqual({ type: 4, words: '\t', code: '→' })
    expect(s.next()).toBe(4)
    expect(s.collect()).toStrictEqual({ type: 2, words: '，', code: ',' })
    expect(s.next()).toBe(5)
    expect(s.collect()).toStrictEqual({ type: 2, words: '。', code: '.' })
    expect(s.next()).toBe(-1)
  })
})

function exNextAndCollectTT(s: Segment, nextIndex: number, tobe: string) {
  expect(s.next()).toBe(nextIndex)
  expect(s.collect()).toStrictEqual({ type: 1, value: tree.get(tobe) })
}
