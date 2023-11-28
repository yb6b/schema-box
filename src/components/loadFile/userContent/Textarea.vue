<script setup>
import { inject, ref, watchEffect } from 'vue'
import RawFile from 'libs/platforms/rawFile'
import { nanoid6 } from 'libs/utils'

const e = defineEmits(['value'])
const dictMode = inject('dictMode')
const contentRef = ref('')
watchEffect(() => {
  if (contentRef.value)
    e('value', new RawFile(contentRef.value, `用户输入_${nanoid6()}`))
})
</script>

<template>
  <QInput
    v-model="contentRef"
    clearable
    autofocus
    outlined
    :debounce="300"
    type="textarea"
    :label="dictMode ? '码表内容' : '文章内容'"
    stack-label
    :placeholder="dictMode ? `粘贴你的码表，如：&#10;a 工 戈&#10;aa 式&#10;……` : '此处粘贴文本'"
    style="font-family: monospace"
  />
</template>
