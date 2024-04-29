<script setup lang="ts">
import { inject } from 'vue'
import { jResultRef } from '../inject'

const res = inject(jResultRef) !

if (!res.value.name)
  res.value.name = ''
</script>

<template>
  <div class="column q-gutter-sm">
    <QInput
      v-model="res.name"
      class="col"
      label="文章名称"
      stack-label
      placeholder="请输入名称"
    />
  </div>
</template>
