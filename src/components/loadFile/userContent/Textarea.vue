<script setup lang="ts">
import { inject, watchEffect } from 'vue'
import { sliceString } from 'libs/utils/string'
import { jDictMode, jResultRef } from '../inject'

const dictMode = inject(jDictMode)!
const res = inject(jResultRef)!

watchEffect(() => {
  if (res.value.txt)
    res.value.name = `键入_${sliceString(res.value.txt, 0, 6)}`
})
</script>

<template>
  <QInput
    v-model="res.txt"
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
