<script setup lang="ts">
import { provide, ref } from 'vue'
import type { Schema, SchemaConfig } from 'libs/schema'
import { createEmptySchema } from 'src/libs/schema/schemaUtils'
import type RawFile from 'src/libs/platforms/rawFile'
import GetUserContent from './userContent/GetUserContent.vue'
import DictOptions from './options/DictOptions.vue'
import ArticleOptions from './options/ArticleOptions.vue'

export interface LoadFileResult {
  raw?: RawFile
  schema?: Schema
  text?: string
  option?: SchemaConfig
}

const props = defineProps<{
  dictMode?: boolean
  preset?: LoadFileResult
}>()

const emits = defineEmits<{
  value: [v: LoadFileResult]
}>()

provide('dictMode', !!props.dictMode)

const resultRef = ref<LoadFileResult>({})
if (props.dictMode)
  resultRef.value.schema = createEmptySchema()

provide('result', resultRef)

const stepPageRef = ref(props.preset ? 2 : 1)

function handlePrimaryBtn() {
  if (stepPageRef.value === 1)
    stepPageRef.value = 2
  else
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
        <DictOptions v-if="props.dictMode" />
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
        :disable="stepPageRef === 1 && !resultRef.text"
        :label="stepPageRef < 2 ? '下一步' : '完 成'"
        @click="handlePrimaryBtn"
      />
    </QCardActions>
  </QCard>
</template>
