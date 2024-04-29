import { bench } from 'vitest'
import { AnalysisResult } from './analysis-result'
import { createTree, treeAdd } from './unique-trie-tree'
import { Segment } from './segmentation'
import type { MabiaoItem } from '@/libs/schema'

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
const seg = new Segment(tree, '不是，也$是不是是')
v.forEach(v => treeAdd(tree, v as any, 1))

// eslint-disable-next-line test/consistent-test-it
bench('简易添加的性能测试', () => {
  run()
})

function run() {
  seg.index = 0
  const ar = new AnalysisResult(3, 3, 5)
  let i = seg.next()
  while (i !== -1) {
    ar.add(seg)
    i = seg.next()
  }
  return ar.reform()
}
