<script setup lang="ts">
import type { EvaluateItems } from 'libs/evaluate/hanzi'
import type { QTableProps } from 'quasar'
import { formatFloat } from 'libs/utils'

defineProps<{
  rangeLabel: string
  mbName: string
  evaItem: EvaluateItems
  indexLabel?: string

}>()
defineEmits<{
  click: [result:{
    title: QTableProps['title']
    columns: QTableProps['columns']
    rows: QTableProps['rows']
  }]
}>()
const normalCollumns: QTableProps['columns'] = [
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
    name: 'freq',
    label: '字频',
    field: 'freq',
  },
  {
    name: 'line',
    label: '码表行数',
    field: 'line',
  },
]
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
const eachRow1 = [
  ['L1', '一码字'],
  ['L2', '二码字'],
  ['L3', '三码字'],
  ['L4', '四码字'],
  ['collision', '选重'],
  ['brief2', '理论二简'],
] as const
const eachRow2 = [
  ['dh', '左右互击'],
  ['ms', '同指大跨排'],
  ['ss', '同指小跨排'],
  ['pd', '小指干扰'],
  ['lfd', '错手'],
  ['trible', '三连击'],
  ['overKey', '超标键位'],
] as const
</script>

<template>
  <tr>
    <td class="text-right bg-teal-1">
      {{ indexLabel || rangeLabel }}
    </td>
    <template
      v-for="j of eachRow1"
      :key="j[0]"
    >
      <td
        v-if="evaItem[j[0]].length"
        class="cursor-pointer hover-dark text-right" @click="() => {
          $emit('click', {
            title: `${mbName} 第 ${rangeLabel} 条的${j[1]}`,
            columns: normalCollumns,
            rows: evaItem[j[0]],
          })
        }"
      >
        {{ evaItem[j[0]].length }}
      </td>
      <td v-else class="text-right">
        {{ evaItem[j[0]].length }}
      </td>
    </template>
    <td class="text-right">
      {{ formatFloat(evaItem.CL / evaItem.freq) }}
    </td>
    <td class="text-right">
      {{ formatFloat(evaItem.ziEq / evaItem.freq) }}
    </td>
    <td class="text-right">
      {{ formatFloat(evaItem.keyEq / evaItem.freq) }}
    </td>
    <template
      v-for="j of eachRow2"
      :key="j[0]"
    >
      <td
        v-if="evaItem[j[0]].length"
        class="cursor-pointer hover-dark text-right" @click="() => {
          $emit('click', {
            title: `${mbName} 第 ${rangeLabel} 条的${j[1]}`,
            columns: normalCollumns,
            rows: evaItem[j[0]],
          })
        }"
      >
        {{ evaItem[j[0]].length }}
      </td>
      <td v-else class="text-right">
        {{ evaItem[j[0]].length }}
      </td>
    </template>

    <td
      v-if="evaItem.lack.length"
      class="cursor-pointer hover-dark text-right" @click="() => {
        $emit('click', {
          title: `${mbName} 第 ${rangeLabel} 条的缺字`,
          columns: lackCollumns,
          rows: evaItem.lack,
        })
      }"
    >
      {{ evaItem.lack.length }}
    </td>
    <td v-else class="text-right">
      {{ evaItem.lack.length }}
    </td>
  </tr>
</template>
