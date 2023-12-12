<script setup lang="ts">
import { provide, ref } from 'vue'
import type { Schema } from 'libs/schema'
import { createEmptySchema } from 'src/libs/schema/schemaUtils'
import RawFile from 'libs/platforms/rawFile'
import GetUserContent from './userContent/GetUserContent.vue'
import DictOptions from './options/DictOptions.vue'
import ArticleOptions from './options/ArticleOptions.vue'

/** 子程序只改动schema以外的属性 */

const props = defineProps<{
  dictMode?: boolean
  preset?: Schema
}>()

const emits = defineEmits<{
  value: [v: Schema]
}>()

const dictMode = !!props.dictMode

provide('dictMode', dictMode)

const resultRef = ref<Schema>(props.preset || createEmptySchema())

provide('result', resultRef)

const hasPreset = !!props.preset?.dicts?.length
if (hasPreset)
  resultRef.value = props.preset
const stepPageRef = ref(hasPreset ? 2 : 1)

function handlePrimaryBtn() {
  if (stepPageRef.value === 1) {
    stepPageRef.value = 2
    return
  }
  if (dictMode)
    resultRef.value.cfg.raw = new RawFile(resultRef.value.cfg.txt!)
  emits('value', resultRef.value)
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
        :disable="stepPageRef === 1 && !resultRef.cfg?.txt"
        :label="stepPageRef < 2 ? '下一步' : '完 成'"
        @click="handlePrimaryBtn"
      />
    </QCardActions>
  </QCard>
</template>
