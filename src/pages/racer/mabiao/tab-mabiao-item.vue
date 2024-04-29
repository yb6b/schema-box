<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
}>()
</script>

<template>
  <div class="text-subtitle2 text-blue-grey-8 text-spacing">
    {{ label }}
  </div>
  <div class="text-h4">
    {{ value }}
  </div>
</template>
