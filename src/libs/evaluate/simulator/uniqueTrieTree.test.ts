import type { SchemaDictItem } from 'libs/schema'
import { createUniqueTrieTree, treeAdd, treeDelete, treeGet } from './uniqueTrieTree'

const ttvs: SchemaDictItem[] = [
  ['不', 'aa', 1],
  ['是', 'aa', 2],
  ['是', 'abb', 3],
  ['是不', 'aabb', 4],
  ['是不是', 'aabb', 5],
]

describe('添加字典树', () => {
  it('treeGet', () => {
    const tree = createUniqueTrieTree()
    expect(treeGet(tree, '不')).toBe(undefined)
  })

  it('添加最短', () => {
    const tree = createUniqueTrieTree()

    treeAdd(tree, ttvs[0], 1)
    expect(tree.get('不')).toStrictEqual({ i: ttvs[0], p: 1, c: 1 })

    treeAdd(tree, ttvs[1], 1)
    expect(tree.get('不')).toStrictEqual({ i: ttvs[0], p: 1, c: 1 })
    expect(tree.get('是')).toStrictEqual({ i: ttvs[1], p: 1, c: 1 })

    treeAdd(tree, ttvs[2], 2) // 两个 是，应该是前一个
    expect(tree.get('是')).toStrictEqual({ i: ttvs[1], p: 1, c: 1 })
  })

  it('添加最新', () => {
    const tree = createUniqueTrieTree()
    treeAdd(tree, ttvs[1], 1, false)
    treeAdd(tree, ttvs[2], 1, false)
    // 两个是，应该是后一个
    expect(tree.get('是')).toStrictEqual({ i: ttvs[2], p: 1, c: 1 })
  })

  it('空穴', () => {
    const tree = createUniqueTrieTree()
    treeAdd(tree, ttvs[4], 1)
    expect(tree.get('是')).toStrictEqual({ i: null, p: 3, c: 0 })
    expect(tree.get('是不')).toStrictEqual({ i: null, p: 3, c: 0 })
    expect(tree.get('是不是')).toStrictEqual({ i: ttvs[4], p: 3, c: 1 })
  })

  it('居中的空穴', () => {
    const tree = createUniqueTrieTree()
    treeAdd(tree, ttvs[4], 3)
    expect(tree.get('是')).toStrictEqual({ i: null, p: 3, c: 0 })
    treeAdd(tree, ttvs[1], 2)
    expect(tree.get('是')).toStrictEqual({ i: ttvs[1], p: 3, c: 2 })
    // 空穴
    expect(tree.get('是不')).toStrictEqual({ i: null, p: 3, c: 0 })
    expect(tree.get('是不是')).toStrictEqual({ i: ttvs[4], p: 3, c: 3 })
  })
})

describe('删除字典树', () => {
  it('删除唯一个', () => {
    const tree = createUniqueTrieTree()
    treeAdd(tree, ttvs[0], 1)
    expect(treeDelete(tree, '是')).toBe(false)
    expect(treeDelete(tree, '不')).toBe(true)
    expect(tree.size).toBe(0)
  })

  it('删除短的', () => {
    const tree = createUniqueTrieTree()
    treeAdd(tree, ttvs[4], 3)
    treeAdd(tree, ttvs[1], 2)
    expect(treeDelete(tree, '是')).toBe(true)
    expect(tree.size).toBe(3)
    expect(tree.get('是')).toStrictEqual({ i: null, p: 3, c: 0 })
  })
})
