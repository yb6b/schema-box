<script setup>
import { reactive, watchEffect } from 'vue'

const p = defineProps(['filename'])
const e = defineEmits(['value'])

const articleOptions = reactive({
  name: '',
})

// 允许修改名称
watchEffect(() => {
  if (p.filename)
    articleOptions.name = p.filename
})

watchEffect(() => {
  e('value', { ...articleOptions })
})
</script>

<template>
  <div class="column q-gutter-sm">
    <QInput
      v-model="articleOptions.name"
      class="col"
      label="文章名称"
      stack-label
      placeholder="请输入名称"
    />
  </div>
</template>
