/**
 * 测评每一项的行为,
 * 如果要添加新的测评项目, 先修改 hanzi/index.ts 里的 evaluateSections()
 */

import type { QTableProps } from 'quasar'
import type { EvaluateHanziItem, EvaluateLineHanzi, EvaluateLineWords } from 'libs/evaluate/hanzi'
import { isNormal } from 'libs/evaluate/hanzi'
import type { Mabiao } from 'src/libs/schema'
import { formatFloat, freqToRelativeFreq, totalFreq } from 'libs/utils'
import { workmanWeightSrc } from './photoBase64'
import * as col from './collumns'

export interface EvaluateItemAction<T> {
  /** 中文名 */
  zhName: string
  /** 表格头里的名称 */
  headHtml: string
  /** 表格头的弹出说明 */
  headInfoHtml?: string
  /** 弹出说明要不要取消限制宽度 */
  headInfoHtmlNoContainer?: boolean
  /** 显示单元格里的内容 */
  display: (line: T, other?: any) => string | number
  /** 显示加权单元格的内容, 不填则显示 /  */
  displayWeight?: (line: T, other?: any) => number
  table?: {
    /**
     * 详细表格的标题
     *
     * 如果不填,会自动补充成 《五笔》中第0~500行的zhName
     */
    title?: (line: T, mb: Mabiao) => string
    /** 表格的每一列 */
    collumns: (line: T) => QTableProps['columns']
    /** 表格里的每一行，通常要filter items */
    rows: (line: T) => QTableProps['rows']
  }
}

/** 单字测评 */
export const singleActions: EvaluateItemAction<EvaluateLineHanzi>[] = [
  {
    zhName: '一码',
    headHtml: '1 码',
    display: makeDisplayByCount(v => v.cdLen === 1),
    displayWeight: makeDisplayWeightCodeLen(1),
    table: {
      collumns: col.getNormalCollumns,
      rows: makeTableRow(v => v.cdLen === 1),
    },
  },
  {
    zhName: '二码',
    headHtml: '2 码',
    display: makeDisplayByCount(v => v.cdLen === 2),
    displayWeight: makeDisplayWeightCodeLen(2),
    table: {
      collumns: col.getNormalCollumns,
      rows: makeTableRow(v => v.cdLen === 2),
    },
  },
  {
    zhName: '三码',
    headHtml: '3 码',
    display: makeDisplayByCount(v => v.cdLen === 3),
    displayWeight: makeDisplayWeightCodeLen(3),
    table: {
      collumns: col.getNormalCollumns,
      rows: makeTableRow(v => v.cdLen === 3),
    },
  },
  {
    zhName: '四码',
    headHtml: '4 码',
    display: makeDisplayByCount(v => v.cdLen === 4),
    displayWeight: makeDisplayWeightCodeLen(4),
    table: {
      collumns: col.getNormalCollumns,
      rows: makeTableRow(v => v.cdLen === 4),
    },
  },
  {
    zhName: '选重',
    headHtml: '<span class="text-red-8">选重</span>',
    headInfoHtml: '码表取最短码长的单字之后，如果要选重（不能顶字上屏，只能按选重键），则统计它。',
    display: makeDisplayByCount(v => v.collision > 1),
    displayWeight: makeDisplayWeightByCount(v => Number(v.collision > 1)),
    table: {
      collumns: col.getNormalCollumns,
      rows: makeTableRow(v => v.collision > 1),
    },
  },
  {
    zhName: '理论二简',
    headHtml: '理论<br>二简',
    headInfoHtml: '统计已取出编码中最大、无重的二简的数量，并计算其加权比重。',
    display: makeDisplayByCount(v => v.brief2),
    displayWeight: makeDisplayWeightByCount(v => Number(v.brief2)),
    table: {
      collumns: col.getNormalCollumns,
      rows: makeTableRow(v => v.brief2),
    },
  },
  {
    zhName: '加权键长',
    headHtml: '加权<br>键长',
    headInfoHtml: '键长 = 编码 + 选重键',
    display: makeDisplayByWeight(v => v.CL),
  },
  {
    zhName: '加权字均当量',
    headHtml: '加权<br>字均当量',
    headInfoHtmlNoContainer: true,
    headInfoHtml: '加权字均当量 = （每字当量 × 字频值）之和 ÷ （字频值之和）<br>单字当量 = 各按键组合的陈一凡当量之和',
    display: makeDisplayByWeight(v => v.ziEq),
  },
  {
    zhName: '加权键均当量',
    headHtml: '加权<br>键均当量',
    headInfoHtmlNoContainer: true,
    headInfoHtml: '加权键均当量 = （键均当量 × 字频值）之和 ÷ 字频值之和<br>键均当量 = 单字当量 ÷ (键长 - 1)<br>键长 = 编码 + 选重键<br>',
    display: makeDisplayByWeight(v => v.keyEq),
  },
  {
    zhName: '用指平衡',
    headHtml: '用指<br>平衡',
    headInfoHtml: `<p>各按键使用频率，与Workman布局的按键权重的均方根误差</p>
    <p><b class="text-negative">注意：</b>用指平衡只适合在<b>相同码元</b>的方案之间比较。</p>
    <img width='280' src="${workmanWeightSrc}" alt="workman 布局的按键权重" />`,
    display: (line, baseFinLoadRate: Record<string, number>) => {
      const finLoad = freqToRelativeFreq(line.usage)
      let a = 0
      let b = 0
      for (const [key, freq] of Object.entries(baseFinLoadRate)) {
        if (key in finLoad) {
          const dist = finLoad[key] - freq
          a += dist * dist
        }
        b++
      }
      const rs = Math.sqrt(a / b)
      return formatFloat(rs, 4, true)
    },
  },
  {
    zhName: '左右互击',
    headHtml: '左右<br>互击',
    headInfoHtml: '两个按键不在同一个手区域。',
    display: makeDisplayByCount(v => v.dh),
    displayWeight: makeDisplayWeightByCombo(v => v.dh),
    table: {
      collumns: col.makeCountCollumns('左右互击', 'dh'),
      rows: makeTableRow(v => v.dh),
    },
  },
  {
    zhName: '同指大跨排',
    headHtml: '同指<br>大跨排',
    headInfoHtml: '<p>两个按键需要用相同手指，但不是同一键。<br>两键相距 <b>两排或多排</b>。</p>例如：<kbd>ce</kbd>',
    display: makeDisplayByCount(v => v.ms),
    displayWeight: makeDisplayWeightByCombo(v => v.ms),
    table: {
      collumns: col.makeCountCollumns('同指大跨排', 'ms'),
      rows: makeTableRow(v => v.ms),
    },
  },
  {
    zhName: '同指小跨排',
    headHtml: '同指<br>小跨排',
    headInfoHtml: '<p>两个按键需要用相同手指，但不是同一键。<br>两键相距 <b>一排或一列</b>。</p>例如：<kbd>de</kbd>',
    display: makeDisplayByCount(v => v.ss),
    displayWeight: makeDisplayWeightByCombo(v => v.ss),
    table: {
      collumns: col.makeCountCollumns('同指小跨排', 'ss'),
      rows: makeTableRow(v => v.ss),
    },
  },
  {
    zhName: '小指干扰',
    headHtml: '小指<br>干扰',
    headInfoHtml: '<p>在两个按键中，小指的使用对其它手指产生神经干扰。</p>例如: <kbd>aw pk</kbd>',
    display: makeDisplayByCount(v => v.pd),
    displayWeight: makeDisplayWeightByCombo(v => v.pd),
    table: {
      collumns: col.makeCountCollumns('小指干扰', 'pd'),
      rows: makeTableRow(v => v.pd),
    },
  },
  {
    zhName: '错手',
    headHtml: '错手',
    headInfoHtml: '<p>因为中指、无名指下沉带动手掌下沉，导致高位按键难以按下的情况。</p>例如: <kbd>xe cr</kbd>',
    display: makeDisplayByCount(v => v.lfd),
    displayWeight: makeDisplayWeightByCombo(v => v.lfd),
    table: {
      collumns: col.makeCountCollumns('错手', 'lfd'),
      rows: makeTableRow(v => v.lfd),
    },
  },
  {

    zhName: '三连击',
    headHtml: '三连击',
    headInfoHtml: '连续三个键相同',
    display: makeDisplayByCount(v => v.trible),
    displayWeight: makeDisplayWeightByCount(v => Number(v.trible > 0)),
    table: {
      collumns: col.makeCountCollumns('三连击', 'trible'),
      rows: makeTableRow(v => v.trible),
    },
  },
  {
    zhName: '超标键位',
    headHtml: '超标<br>键位',
    headInfoHtml: '<p>编码使用到了46个按键以外的按键。</p>46个按键指主键盘区所有能打出字符的按键（包括空格），再排除<kbd>`\\</kbd>两键。',
    display: line => line.items.reduce(
      (p, c) => p + ('overKey' in c ? c.overKey : 0),
      0,
    ),
    displayWeight: (line) => {
      let totalWeight = 0
      for (const e of line.items) {
        if ('overKey' in e)
          totalWeight += e.freq * e.overKey
      }
      return totalWeight / line.freq
    },
    table: {
      collumns: col.makeCountCollumns('超标键位', 'overKey'),
      rows: line => line.items.filter(v => 'overKey' in v && v.overKey > 0),
    },
  },
  {
    zhName: '缺字标记',
    headHtml: '缺字<br>标记',
    headInfoHtml: '码表中缺少某字',
    displayWeight: (line) => {
      let totalWeight = 0
      for (const e of line.items) {
        if (!('overKey' in e))
          totalWeight += e.freq
      }
      return totalWeight / line.freq
    },
    display: line => line.items.reduce(
      (p, c) => p + Number(!('overKey' in c)),
      0,
    ),
    table: {
      collumns: col.getLackCollumns,
      rows: line => line.items.filter(v => !('overKey' in v)),
    },
  },
]

/** 组词测评 */
export const wordsActions: EvaluateItemAction<EvaluateLineWords>[] = [
  {
    zhName: '选重',
    headHtml: '<span class="text-red-8">加权<br>选重</span>',
    headInfoHtml: '生成词语编码之后，如果要选重（非首选），则统计它。',
    display: makeDisplayByCount(v => v.collision > 1),
    displayWeight: makeDisplayWeightByCount(v => v.collision > 1 ? v.collision : 0),
    table: {
      collumns: col.getWordsCollumnsNormal,
      rows: makeTableRow(v => v.collision > 1),
    },
  },
  {
    zhName: '加权词均当量',
    headHtml: '加权<br>词均当量',
    headInfoHtml: '加权词均当量 = （编码的当量 × 词频值）之和 ÷ （词频值之和）<br>当量 = 各按键组合的陈一凡当量之和',
    display: makeDisplayByWeight(v => v.eq),
  },
  {
    zhName: '左右互击',
    headHtml: '左右<br>互击',
    headInfoHtml: '两个按键不在同一个手区域。',
    display: makeDisplayByCount(v => v.dh),
    displayWeight: makeDisplayWeightByCombo(v => v.dh),
    table: {
      collumns: col.makeWordsCountCollumns('左右互击', 'dh'),
      rows: makeTableRow(v => v.dh),
    },
  },
  {
    zhName: '同指大跨排',
    headHtml: '同指<br>大跨排',
    headInfoHtml: '<p>两个按键需要用相同手指，但不是同一键。<br>两键相距 <b>两排或多排</b>。</p>例如：<kbd>ce</kbd>',
    display: makeDisplayByCount(v => v.ms),
    displayWeight: makeDisplayWeightByCombo(v => v.ms),
    table: {
      collumns: col.makeWordsCountCollumns('同指大跨排', 'ms'),
      rows: makeTableRow(v => v.ms),
    },
  },
  {
    zhName: '同指小跨排',
    headHtml: '同指<br>小跨排',
    headInfoHtml: '<p>两个按键需要用相同手指，但不是同一键。<br>两键相距 <b>一排或一列</b>。</p>例如：<kbd>de</kbd>',
    display: makeDisplayByCount(v => v.ss),
    displayWeight: makeDisplayWeightByCombo(v => v.ss),
    table: {
      collumns: col.makeWordsCountCollumns('同指小跨排', 'ss'),
      rows: makeTableRow(v => v.ss),
    },
  },
  {
    zhName: '小指干扰',
    headHtml: '小指<br>干扰',
    headInfoHtml: '<p>在两个按键中，小指的使用对其它手指产生神经干扰。</p>例如: <kbd>aw pk</kbd>',
    display: makeDisplayByCount(v => v.pd),
    displayWeight: makeDisplayWeightByCombo(v => v.pd),
    table: {
      collumns: col.makeWordsCountCollumns('小指干扰', 'pd'),
      rows: makeTableRow(v => v.pd),
    },
  },
  {
    zhName: '错手',
    headHtml: '错手',
    headInfoHtml: '<p>因为中指、无名指下沉带动手掌下沉，导致高位按键难以按下的情况。</p>例如: <kbd>xe cr</kbd>',
    display: makeDisplayByCount(v => v.lfd),
    displayWeight: makeDisplayWeightByCombo(v => v.lfd),
    table: {
      collumns: col.makeWordsCountCollumns('错手', 'lfd'),
      rows: makeTableRow(v => v.lfd),
    },
  },
  {

    zhName: '三连击',
    headHtml: '三连击',
    headInfoHtml: '连续三个键相同',
    display: makeDisplayByCount(v => v.trible),
    displayWeight: makeDisplayWeightByCount(v => Number(v.trible > 0)),
    table: {
      collumns: col.makeWordsCountCollumns('三连击', 'trible'),
      rows: makeTableRow(v => v.trible),
    },
  },
  {
    zhName: '超标键位',
    headHtml: '超标<br>键位',
    headInfoHtml: '<p>编码使用到了46个按键以外的按键。</p>46个按键指主键盘区所有能打出字符的按键（包括空格），再排除<kbd>`\\</kbd>两键。',
    display: line => line.items.reduce(
      (p, c) => p + ('overKey' in c ? c.overKey : 0),
      0,
    ),
    displayWeight: (line) => {
      let totalWeight = 0
      for (const e of line.items) {
        if ('overKey' in e)
          totalWeight += e.freq * e.overKey
      }
      return totalWeight / line.freq
    },
    table: {
      collumns: col.makeCountCollumns('超标键位', 'overKey'),
      rows: line => line.items.filter(v => 'overKey' in v && v.overKey > 0),
    },
  },
  {
    zhName: '缺字标记',
    headHtml: '缺字<br>标记',
    headInfoHtml: '码表中缺少某字',
    displayWeight: (line) => {
      let totalWeight = 0
      for (const e of line.items) {
        if (!('overKey' in e))
          totalWeight += e.freq
      }
      return totalWeight / line.freq
    },
    display: line => line.items.reduce(
      (p, c) => p + Number(!('overKey' in c)),
      0,
    ),
    table: {
      collumns: col.getLackCollumns,
      rows: line => line.items.filter(v => !('overKey' in v)),
    },
  },
]

/**
 * 辅助生成Display, 用于整数求和的场景
 * @param handler 如何提取每一项的求和数据
 */
function makeDisplayByCount(handler: (v: any) => number | boolean) {
  return (line: any) => {
    let result = 0
    for (const e of line.items) {
      if (isNormal(e))
        result += handler(e) as number
    }
    return result
  }
}

/**
 * 辅助生成Display, 用于加权求和的项
 * @param handler 如何提取每一项的求和数据
 */
function makeDisplayByWeight(handler: (v: any) => number | boolean) {
  return (line: any) => {
    let result = 0
    for (const e of line.items) {
      if (isNormal(e))
        result += handler(e) as number
    }
    result /= line.freq
    return formatFloat(result)
  }
}

/**
 * 辅助生成表格行, 会过滤缺字和超标
 * @param handler 如何过滤每一个item
 */
function makeTableRow(handler: (v: any) => boolean) {
  return (line: any) => line.items.filter((v: any) => isNormal(v) && handler(v))
}

function makeDisplayWeightCodeLen(cdLen: number) {
  return (line: EvaluateLineHanzi) => {
    let totalWeight = 0
    for (const it of line.items) {
      if (isNormal(it) && (it as EvaluateHanziItem).cdLen === cdLen)
        totalWeight += it.freq
    }
    return totalWeight / line.freq
  }
}

/**
 * 辅助生成小计列
 * @param handler 如何处理每一项的被加权值
 */
function makeDisplayWeightByCount(handler: (v: EvaluateHanziItem) => number) {
  return (line: EvaluateLineHanzi) => {
    let totalWeight = 0
    for (const it of line.items) {
      if (isNormal(it))
        totalWeight += handler(it as EvaluateHanziItem) * it.freq
    }
    return totalWeight / line.freq
  }
}

/**
 * 辅助生成小计列
 * @param handler 如何处理每一项的被加权值
 */
function makeDisplayWeightByCombo(handler: (v: EvaluateHanziItem) => number) {
  return (line: EvaluateLineHanzi) => {
    let totalWeight = 0 // 分子
    let totalKeyLenByWeight = 0 // 分母
    for (const it of line.items) {
      if (!isNormal(it))
        continue
      totalWeight += handler(it as EvaluateHanziItem) * it.freq
      let cdLen = (it as EvaluateHanziItem).cdLen
      if ('selectKey' in it && it.selectKey.length > 0)
        cdLen += it.selectKey.length
      totalKeyLenByWeight += it.freq * (cdLen < 2 ? 1 : cdLen - 1)
    }

    return totalWeight / totalKeyLenByWeight
  }
}
