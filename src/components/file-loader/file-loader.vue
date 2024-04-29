<script setup lang="ts">
import { provide, ref, shallowRef, toValue } from 'vue'
import GetUserContent from './user-content/user-content.vue'
import DictOptions from './options/options-dict.vue'
import ArticleOptions from './options/options-article.vue'
import { jDictMode, jResultRef } from './inject'
import { RawFile } from '@/libs/platforms/raw-file'
import { type Mabiao, createEmptyMabiao } from '@/libs/schema'

const props = defineProps<{
  dictMode?: boolean
  preset?: Mabiao
}>()

const emits = defineEmits<{
  value: [v: Mabiao]
}>()

const dictMode = !!props.dictMode

provide(jDictMode, dictMode)

const resultRef = ref<Mabiao>(props.preset || createEmptyMabiao())

provide(jResultRef, resultRef)

const hasPreset = !!props.preset?.name
const stepPageRef = ref(hasPreset ? 2 : 1)

function handlePrimaryBtn() {
  // 第一页 翻页
  if (stepPageRef.value === 1) {
    stepPageRef.value = 2
    return
  }
  // 第二页
  emits('value', toValue(resultRef))
}
</script>

<template>
  <QCard style="min-width: min(85vw, 24rem);">
    <QStepper v-model="stepPageRef" animated keep-alive flat dense>
      <QStep :name="1" title="获取" :done="stepPageRef > 1">
        <GetUserContent style="min-height:12rem;" />
      </QStep>
      <QStep :name="2" title="配置" :done="stepPageRef > 2">
        <DictOptions v-if="dictMode" />
        <ArticleOptions v-else />
      </QStep>
    </QStepper>

    <QCardActions align="right">
      <QBtn
        v-show="stepPageRef > 1"
        flat
        label="上一步"
        @click="() => stepPageRef -= 1"
      />
      <QBtn
        color="primary"
        :disable="stepPageRef === 1 && !resultRef"
        :label="stepPageRef < 2 ? '下一步' : '完 成'"
        @click="handlePrimaryBtn"
      />
    </QCardActions>
  </QCard>
</template>
