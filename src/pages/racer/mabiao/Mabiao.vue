<script setup lang="ts">
import type { Mabiao } from 'src/libs/schema'

/** 测评码表本身 */
const props = defineProps<{
  mabiao: Mabiao
}>()
</script>

<template>
  <div class="text-h6">
    码表行数
  </div>
  <div class="text-subtitle">
    {{ mabiao.items.length }}
  </div>
</template>
