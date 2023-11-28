import { bench } from 'vitest'
import type { SchemaDictItem } from 'libs/schema'
import { AnalysisResult } from './analysisResult'
import { createTree, treeAdd } from './uniqueTrieTree'
import { Segment } from './segmentation'

const v: SchemaDictItem[] = [
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
// aa b3,?s4b3aa bB2
v.forEach(v => treeAdd(tree, v as any, 1))

it('正常运行', () => {
  const r = run()
  expect(r).toMatchSnapshot()
})

function run() {
  seg.index = 0
  const ar = new AnalysisResult(3, 3, 5)
  let i = seg.next()
  while (i !== -1) {
    ar.add(seg)
    i = seg.next()
  }
  ar.reform()
  return ar
}
