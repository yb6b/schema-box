/**
 * 测评每一项的行为,
 * 如果要添加新的测评项目, 先修改 hanzi/index.ts 里的 evaluateSections()
 */

import type { QTableProps } from 'quasar'
import { formatFloat } from 'libs/utils'
import type { EvaluateItems } from 'libs/evaluate/hanzi/index'

type TableCollumn = Exclude<QTableProps['columns'], undefined>
const normalCollumns: TableCollumn = [
  {
    name: 'index',
    label: '汉字',
    field: 'wd',
  },
  {
    name: 'code',
    label: '编码',
    field: 'code',
    classes: 'font-monospace',
  },
  {
    name: 'line',
    label: '码表行数',
    field: 'line',
  },
  {
    name: 'freqRank',
    label: '字频次序',
    field: 'freqRank',
  },
  {
    name: 'freq',
    label: '字频',
    field: 'reFreq',
    format: v => formatFloat(v, 5, true),
  },
]

function countCollumns(name: string): TableCollumn {
  const rs = [...normalCollumns]
  rs.splice(2, 0, {
    name: 'count',
    label: `${name}计数`,
    field: 'count',
  })
  return rs
}

function collisionCollumns() {
  const rs = [...normalCollumns]
  rs.splice(2, 0, {
    name: 'collision',
    label: '选重',
    field: 'collision',
  })
  return rs
}

const lackCollumns: QTableProps['columns'] = [
  {
    name: 'index',
    label: '汉字',
    field: 'wd',
  },
  {
    name: 'freq',
    label: '字频',
    field: 'freq',
  },
]

interface EvaluateItemAction {
  field: keyof EvaluateItems
  /** 中文名 */
  zhName: string
  /** 表格头里的名称 */
  headHtml: string
  /** 表格头的弹出说明 */
  headInfoHtml?: string
  /** 弹出说明要不要取消限制宽度 */
  headInfoHtmlNoContainer?: boolean
  /** 数据处理方式 */
  kind: 'len' | 'count' | 'weight'
  tableCollumn?: QTableProps['columns']
}

export const singleActions: EvaluateItemAction[] = [
  {
    field: 'L1',
    zhName: '一码',
    headHtml: '1 码',
    kind: 'len',
    tableCollumn: normalCollumns,
  },
  {
    field: 'L2',
    zhName: '二码',
    headHtml: '2 码',
    kind: 'len',
    tableCollumn: normalCollumns,
  },

  {
    field: 'L3',
    zhName: '三码',
    headHtml: '3 码',
    kind: 'len',
    tableCollumn: normalCollumns,
  },
  {
    field: 'L4',
    zhName: '四码',
    headHtml: '4 码',
    kind: 'len',
    tableCollumn: normalCollumns,
  },
  {
    field: 'collision',
    zhName: '选重',
    headHtml: '<span class="text-red-8">选重</span>',
    headInfoHtml: '码表取最短码长的单字之后，如果要选重（不能顶字上屏，只能按选重键），则统计它。',
    kind: 'len',
    tableCollumn: collisionCollumns(),
  },
  {
    field: 'brief2',
    zhName: '理论二简',
    headHtml: '理论<br>二简',
    headInfoHtml: '统计已取出编码中最大、无重的二简的数量，并计算其加权比重。',
    kind: 'len',
    tableCollumn: normalCollumns,
  },
  {
    field: 'CL',
    zhName: '加权键长',
    headHtml: '加权<br>键长',
    headInfoHtml: '键长 = 编码 + 选重键',
    kind: 'weight',
  },
  {
    field: 'ziEq',
    zhName: '加权字均当量',
    headHtml: '加权<br>字均当量',
    headInfoHtmlNoContainer: true,
    headInfoHtml: '加权字均当量 = （每字当量 × 字频值）之和 ÷ （字频值之和）<br>单字当量 = 各按键组合的陈一凡当量之和',
    kind: 'weight',
  },
  {
    field: 'keyEq',
    zhName: '加权字均当量',
    headHtml: '加权<br>字均当量',
    headInfoHtmlNoContainer: true,
    headInfoHtml: '加权键均当量 = （键均当量 × 字频值）之和 ÷ 字频值之和<br>键均当量 = 单字当量 ÷ (键长 - 1)<br>键长 = 编码 + 选重键<br>',
    kind: 'weight',
  },
  {
    field: 'dh',
    zhName: '左右互击',
    headHtml: '左右<br>互击',
    headInfoHtml: '两个按键不在同一个手区域。',
    kind: 'count',
    tableCollumn: countCollumns('左右互击'),
  },
  {
    field: 'ms',
    zhName: '同指大跨排',
    headHtml: '同指<br>大跨排',
    headInfoHtml: '<p>两个按键需要用相同手指，但不是同一键。<br>两键相距 <b>两排或多排</b>。</p>例如：<kbd>ce</kbd>',
    kind: 'count',
    tableCollumn: countCollumns('同指大跨排'),
  },
  {
    field: 'ss',
    zhName: '同指小跨排',
    headHtml: '同指<br>小跨排',
    headInfoHtml: '<p>两个按键需要用相同手指，但不是同一键。<br>两键相距 <b>一排或一列</b>。</p>例如：<kbd>de</kbd>',
    kind: 'count',
    tableCollumn: countCollumns('同指小跨排'),
  },
  {
    field: 'pd',
    zhName: '小指干扰',
    headHtml: '小指<br>干扰',
    headInfoHtml: '<p>在两个按键中，小指的使用对其它手指产生神经干扰。</p>例如: <kbd>aw pk</kbd>',
    kind: 'count',
    tableCollumn: countCollumns('小指干扰'),
  },
  {
    field: 'lfd',
    zhName: '错手',
    headHtml: '错手',
    headInfoHtml: '<p>因为中指、无名指下沉带动手掌下沉，导致高位按键难以按下的情况。</p>例如: <kbd>xe cr</kbd>',
    kind: 'count',
    tableCollumn: countCollumns('错手'),
  },
  {
    field: 'trible',
    zhName: '三连击',
    headHtml: '三连击',
    headInfoHtml: '连续三个键相同',
    kind: 'count',
    tableCollumn: countCollumns('三连击'),
  },
  {
    field: 'overKey',
    zhName: '超标键位',
    headHtml: '超标<br>键位',
    headInfoHtml: '<p>该字的编码使用到了46个按键以外的按键。</p>46个按键指主键盘区所有能打出字符的按键（包括空格），再排除<kbd>`\\</kbd>两键。',
    kind: 'count',
    tableCollumn: countCollumns('超标键位'),
  },
  {
    field: 'lack',
    zhName: '缺字标记',
    headHtml: '缺字<br>标记',
    headInfoHtml: '码表中缺少某字',
    kind: 'len',
    tableCollumn: lackCollumns,
  },

]
