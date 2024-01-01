<script setup lang="ts">
defineProps<{
  /** 关闭最大宽度的限制 */
  noContainer?: boolean
}>()
</script>

<template>
  <QTooltip :delay="300">
    <div v-if="!noContainer" class="container-sm">
      <slot />
    </div>
    <template v-else>
      <slot />
    </template>
  </QTooltip>
</template>
