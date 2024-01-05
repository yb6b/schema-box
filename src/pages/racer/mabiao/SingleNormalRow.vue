<script setup lang="ts">
import type { EvaluateLineHanzi, EvaluateLineWords } from 'libs/evaluate/hanzi'
import { formatFloat } from 'libs/utils'
import type { Mabiao } from 'libs/schema'
import type { TableRef } from './types'
import type { EvaluateItemAction } from './evaluateItemsAction'

const p = defineProps<{
  /** 如果不填, 则显示行数范围 */
  indexLabel?: string
  mb: Mabiao
  evaluateResult: EvaluateLineWords | EvaluateLineHanzi
  actions: EvaluateItemAction<EvaluateLineWords | EvaluateLineHanzi>[]
  baseFinLoadRate: Record<string, number>
  color: string
}>()
defineEmits<{
  click: [result: TableRef]
}>()

const displays = p.actions.map(act => act.display(p.evaluateResult, p.baseFinLoadRate))
</script>

<template>
  <tr>
    <td class="text-right" :class="[color]">
      {{ indexLabel || `${evaluateResult.start + 1}~${evaluateResult.end}` }}
    </td>
    <template v-for="(action, index) in actions" :key="action.zhName">
      <td
        v-if="'table' in action && displays[index] !== 0"
        class="cursor-pointer hover-dark text-right"
        @click="_ => {
          $emit('click', {
            title: action.table?.title?.(evaluateResult, mb) || `《${mb.name}》中的第 ${evaluateResult.start + 1}~${evaluateResult.end} 条的${action.zhName}`,
            columns: action.table!.collumn(evaluateResult),
            rows: action.table!.rows(evaluateResult),
          })
        }"
      >
        {{ displays[index] }}
      </td>
      <td v-else class="text-right">
        {{ displays[index] }}
      </td>
    </template>
  </tr>
</template>
