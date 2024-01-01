<script setup lang="ts">
import type { EvaluateItems } from 'libs/evaluate/hanzi'
import { formatFloat } from 'libs/utils'
import type { TableRef } from './types'
import { singleActions } from './evaluateItemsAction'

const p = defineProps<{
  rangeLabel: string
  indexLabel?: string
  mbName: string
  evaItem: EvaluateItems
}>()
defineEmits<{
  click: [result: TableRef]
}>()

function fmtCountOrLen(action: typeof singleActions[0]) {
  const eval_item = p.evaItem
  if (action.kind === 'len')
    return (eval_item[action.field] as object[]).length
  else
    return (eval_item[action.field] as EvaluateItems['dh']).reduce((pv, cv) => pv + cv.count, 0)
}
</script>

<template>
  <tr>
    <td class="text-right bg-teal-1">
      {{ indexLabel || rangeLabel }}
    </td>
    <template v-for="action in singleActions" :key="action.zhName">
      <template v-if="action.kind === 'len' || action.kind === 'count'">
        <td
          v-if="(evaItem[action.field] as object[]).length === 0"
          class="text-right"
        >
          0
        </td>
        <td
          v-else
          class="cursor-pointer hover-dark text-right"
          @click="() => {
            $emit('click', {
              title: `${mbName}中的第 ${rangeLabel} 条的${action.zhName}`,
              columns: action.tableCollumn,
              rows: evaItem[action.field] as object[],
            })
          }"
        >
          {{ fmtCountOrLen(action) }}
        </td>
      </template>
      <td
        v-else-if="action.kind === 'weight'"
        class="text-right"
      >
        {{ formatFloat(evaItem[action.field] as number / evaItem.freq) }}
      </td>
    </template>
  </tr>
</template>
