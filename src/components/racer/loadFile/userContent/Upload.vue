<script setup>
import { mdiFolderOpen } from '@quasar/extras/mdi-v7'
import { ref, watchEffect } from 'vue'

const e = defineEmits(['value'])
const fileRef = ref()
watchEffect(async () => {
  if (fileRef.value) {
    const text = await fileRef.value.text()
    e('value', text)
  }
})
</script>

<template>
  <QFile
    v-model="fileRef"
    filled
    dense
    class="col"
    label="打开本地文件"
    bottom-slots
  >
    <template #before>
      <QIcon :name="mdiFolderOpen" />
    </template>
  </QFile>
  <p class="text-primary">
    只支持 utf-8 编码的文本文件。
  </p>
</template>
