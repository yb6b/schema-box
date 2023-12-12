<script setup>
import { inject, watchEffect } from 'vue'
import { nanoid6 } from 'libs/utils'

const dictMode = inject('dictMode')
const res = inject('result')

watchEffect(() => {
  if (res.value.cfg.txt)
    res.value.cfg.name = `用户输入_${nanoid6()}`
})
</script>

<template>
  <QInput
    v-model="res.cfg.txt"
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
