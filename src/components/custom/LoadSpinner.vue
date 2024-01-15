<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <div class="column full-width items-center q-py-lg">
    <QSpinnerGrid class="col" color="primary" size="lg" />
    <div class="col q-py-md text-grey-7">
      {{ label }}
    </div>
  </div>
</template>
