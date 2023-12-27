<script setup lang="ts">
import { formatFloat } from 'libs/utils'

defineProps<{
  evaItem: object
  indexLabel: string
}>()

const arrKeys = ['L1', 'L2', 'L3', 'L4', 'collision', 'brief2', '/', '/', '/', 'dh', 'ms', 'ss', 'pd', 'lfd', 'trible', 'overKey', 'lack'] as const
</script>

<template>
  <tr>
    <td class="text-right bg-teal-1">
      {{ indexLabel }}
    </td>
    <template
      v-for="j of arrKeys"
      :key="j"
    >
      <td class="text-right">
        {{ j === '/' ? '/' : (evaItem as any)[j] === 0 ? '0' : formatFloat((evaItem as any)[j], 2, true) }}
      </td>
    </template>
  </tr>
</template>
