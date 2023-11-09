<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import GetUserContent from './userContent/GetUserContent.vue'
import type { ResultOptions } from './options/DictOptions.vue'
import DictOptions from './options/DictOptions.vue'

const p = defineProps({
  dialog: {
    required: true,
    type: Boolean,
    default: false,
  },
  dictMode: {
    type: Boolean,
    default: false,
  },
  content: String, // 如果已经有数据，则跳过GetUserContent阶段
})

const e = defineEmits<{
  'update:dialog': [value: boolean]
  value: [v: Result]
}>()

interface Result {
  content: string
  options: ResultOptions
}
const result: Result = { content: '', options: {} }

provide('dictMode', p.dictMode)

// 控制弹出窗
const openDialogRef = ref(false)

watch(() => p.dialog, (d) => {
  openDialogRef.value = d
}, { immediate: true })

watch([openDialogRef], () => {
  e('update:dialog', openDialogRef.value)
})

const stepPageRef = ref(p.content ? 2 : 1)

function handlePrimaryBtn() {
  if (stepPageRef.value < 2) {
    stepPageRef.value += 1
  }
  else { // 最后一页
    openDialogRef.value = false // 关闭对话框
    e('value', result) // 触发返回
  }
}
</script>

<template>
  <QDialog v-model="openDialogRef">
    <QCard style="min-width: min(85vw, 24rem);">
      <QStepper v-model="stepPageRef" animated keep-alive flat>
        <QStep :name="1" title="获取" :done="stepPageRef > 1">
          <GetUserContent style="min-height:12rem;" @value="c => result.content = c" />
        </QStep>
        <QStep :name="2" title="配置" :done="stepPageRef > 2">
          <DictOptions @value="v => result.options = v" />
        </QStep>
      </QStepper>

      <QCardActions align="right">
        <QBtn
          v-show="stepPageRef > 1"
          flat
          label="上一步"
          @click="stepPageRef -= 1"
        />
        <QBtn
          color="primary"
          :label="stepPageRef >= 2 ? '完 成' : '下一步'"
          @click="handlePrimaryBtn"
        />
      </QCardActions>
    </QCard>
  </QDialog>
</template>
