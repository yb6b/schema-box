<script setup lang="ts">
import { formatFloat } from 'libs/utils'
import type { EvaluateLineHanzi, EvaluateLineWords } from 'libs/evaluate/hanzi'
import type { EvaluateItemAction } from './evaluateItemsAction'

const p = defineProps<{
  indexLabel: string
  evaluateResult: EvaluateLineWords | EvaluateLineHanzi
  actions: EvaluateItemAction<EvaluateLineWords | EvaluateLineHanzi>[]
  color: string
}>()

function fmt(action: any) {
  if (!('displayWeight' in action))
    return '/'
  const dw = action.displayWeight(p.evaluateResult)
  if (dw === 0)
    return '0'
  return formatFloat(dw)
}
</script>

<template>
  <tr>
    <td class="text-right" :class="[color]">
      {{ indexLabel }}
    </td>
    <template
      v-for="action in actions"
      :key="action.zhName"
    >
      <td class="text-right">
        {{ fmt(action) }}
      </td>
    </template>
  </tr>
</template>
