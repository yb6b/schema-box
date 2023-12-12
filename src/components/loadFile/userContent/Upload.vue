<script setup>
import { mdiFolderOpen } from '@quasar/extras/mdi-v7'
import { inject, ref, watch } from 'vue'
import RawFile from 'libs/platforms/rawFile'

const fileRef = ref()
const hintRef = ref('可以拖动文件到这里')

const res = inject('result')

const fileEncodings = [
  'UTF-8',
  'UTF-16LE',
  'GB18030',
  'BIG5',
]
const encodingRef = ref(fileEncodings[0])

watch(fileRef, async () => {
  const rawData = new RawFile(fileRef.value)
  const t = await rawData.getText()
  hintRef.value = `读到「${t.slice(0, 25)} …」共${t.length}个字符。`
  encodingRef.value = rawData.encoding
  res.value.text = t
  res.value.raw = rawData
  res.value.option = { name: rawData.name }
})

watch(encodingRef, async () => {
  if (fileRef.value) {
    const rawData = new RawFile(fileRef.value)
    rawData.encoding = encodingRef.value
    const t = await rawData.getText()
    hintRef.value = `读到「${t.slice(0, 25)} …」共${t.length}个字符。`
    res.value.text = t
    res.value.raw = rawData
    res.value.option = { name: rawData.name }
  }
})
</script>

<template>
  <QFile
    v-model="fileRef"
    filled
    square
    class="col q-mb-md"
    label="打开本地文件"
    :hint="hintRef"
  >
    <template #before>
      <QIcon :name="mdiFolderOpen" />
    </template>
  </QFile>

  <QSelect
    v-model="encodingRef"
    class="q-mt-lg"
    :options="fileEncodings"
    options-dense
    label="文件编码"
  />
</template>
