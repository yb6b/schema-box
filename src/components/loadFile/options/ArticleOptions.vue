<script setup>
import { inject } from 'vue'

const res = inject('result')

if (!res.value.option)
  res.value.option = { name: '' }
</script>

<template>
  <div class="column q-gutter-sm">
    <QInput
      v-model="res.option.name"
      class="col"
      label="文章名称"
      stack-label
      placeholder="请输入名称"
    />
  </div>
</template>
