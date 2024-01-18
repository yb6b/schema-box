<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { RawFile } from 'libs/platforms'
import { mdiFolderOpen } from '@quasar/extras/mdi-v7'
import { genEachLineJump } from 'libs/utils'

const props = defineProps<{
  label: string
  length: number
  single: boolean
}>()

const emits = defineEmits<{
  tsv: [result: string]
}>()
const userFreqTsvFile = shallowRef<File>()
const txtResult = shallowRef<string>()

const isError = shallowRef(false)
const errorMessage = shallowRef('')

const isOk = computed(() => !!userFreqTsvFile.value && !isError.value)

watch(userFreqTsvFile, async () => {
  const raw = userFreqTsvFile.value
  if (!raw)
    return
  isError.value = false
  const rf = new RawFile(raw)
  const txt = await rf.getText()
  const v = validateTsv(txt)
  if (v) {
    isError.value = false
    isError.value = true
    errorMessage.value = v
  }
  else {
    txtResult.value = txt
  }
})

function onFreqTsvClick() {
  emits('tsv', txtResult.value!)
}

function validateTsv(txt: string): string {
  const len = props.length
  const sin = props.single
  let lastfreq = Number.POSITIVE_INFINITY
  let count = 0
  const numberRe = /^[0-9]+$/
  for (const [line, lineno] of genEachLineJump(txt)) {
    const lineSplit = line.split('\t')
    if (lineSplit.length !== 2)
      return `第 ${lineno} 行不是两列元素`
    if (sin && [...lineSplit[0]].length !== 1)
      return `第 ${lineno} 行的汉字「${lineSplit[0]}」不止一个字`
    if (!numberRe.test(lineSplit[1]))
      return `第 ${lineno} 行的频数「${lineSplit[1]}」不是整数`
    const freq = Number.parseInt(lineSplit[1])
    if (freq > lastfreq)
      return `第 ${lineno} 行「${lineSplit[0]} ${freq}」的频数比上一行大`
    lastfreq = freq
    count++
  }
  if (count < len)
    return `数据只有${count}行，少于${len}行`
  return ''
}
</script>

<template>
  <QCard>
    <QCardSection>
      <QFile
        v-model="userFreqTsvFile"
        style="width: 16rem;"
        filled
        :label="label"
        clearable
        :error="isError"
      >
        <template #prepend>
          <QIcon :name="mdiFolderOpen" />
        </template>
        <template #error>
          {{ errorMessage }}
        </template>
      </QFile>
      <slot />
    </QCardSection>
    <QCardActions align="right">
      <QBtn
        label="确认" flat :disable="!isOk"
        :color="isOk ? 'primary' : 'grey'"
        @click="onFreqTsvClick"
      />
    </QCardActions>
  </QCard>
</template>
