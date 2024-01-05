import type { QTableProps } from 'quasar'
import { formatFloat } from 'libs/utils'

type TableCollumn = Exclude<QTableProps['columns'], undefined>
const lackCollumns: TableCollumn = [
  {
    name: 'index',
    label: '汉字',
    field: 'wd',
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

export function getLackCollumns() {
  return lackCollumns
}

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
    name: 'collision',
    label: '重码位',
    field: 'collision',
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

export function getNormalCollumns() {
  return normalCollumns
}

export function makeCountCollumns(name: string, field: string) {
  return (_: any) => {
    const rs = [...normalCollumns]
    rs.splice(2, 0, {
      name: 'count',
      label: name,
      field,
    })
    return rs
  }
}
