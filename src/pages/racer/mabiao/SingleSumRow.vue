<script setup lang="ts">
import { formatFloat } from 'libs/utils'
import { singleActions } from './evaluateItemsAction'

const p = defineProps<{
  evaItem: object
  indexLabel: string
}>()

function fmt(action: typeof singleActions[0]) {
  const eva = p.evaItem
  if (action.kind === 'weight' || action.kind === 'load')
    return '/'
  if ((eva as any)[action.field] === 0)
    return 0
  const field = (eva as any)[action.field]
  return formatFloat(field, 2, true)
}
</script>

<template>
  <tr>
    <td class="text-right bg-teal-1">
      {{ indexLabel }}
    </td>
    <template
      v-for="action in singleActions"
      :key="action.zhName"
    >
      <td class="text-right">
        {{ fmt(action) }}
      </td>
    </template>
  </tr>
</template>
