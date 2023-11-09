<script setup>
import { inject } from 'vue'

const dictMode = inject('dictMode')
</script>

<template>
  <QInput
    clearable
    autofocus
    outlined
    :debounce="300"
    type="textarea"
    :label="dictMode ? '码表内容' : '文章内容'"
    stack-label
    :placeholder="dictMode ? `粘贴你的码表，如：&#10;a 工 戈&#10;aa 式&#10;……` : '此处粘贴文本'"
    style="font-family: monospace"
    v-bind="$attrs"
  />
</template>
