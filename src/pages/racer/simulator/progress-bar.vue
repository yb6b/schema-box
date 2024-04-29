<script setup lang="ts">
import * as vue from 'vue'
import type { Mabiao } from '@/libs/schema'
import type { FullAnalysisResult } from '@/libs/evaluate/simulator/analysis-result'
import { simulateSchemasAbortable } from '@/libs/evaluate/simulator'

const props = defineProps<{
  article: string
  mb: Mabiao
  mb2: Mabiao
}>()

const emits = defineEmits<{
  result: [result: Result]
}>()
export interface Result {
  analysis1: FullAnalysisResult
  analysis2: FullAnalysisResult
}

const mb1AlreadyWorkload = vue.shallowRef(0)
const mb2AlreadyWorkload = vue.shallowRef(0)

const totalWorkload = vue.computed(() => {
  const articleLen = props.article.length
  const mbLen = props.mb.items.length
  const mb2len = props.mb2.items.length
  return articleLen * 2 + mbLen + mb2len
})

const progress = vue.computed(() => (mb1AlreadyWorkload.value + mb2AlreadyWorkload.value) / totalWorkload.value)

const opts = {
  article: props.article,
  mb: props.mb,
  shouldAbort: false,
  alreadyCount: mb1AlreadyWorkload,
}

vue.onMounted(async () => {
  console.time('first')
  const analysis1 = await simulateSchemasAbortable(opts) as FullAnalysisResult
  console.timeEnd('first')
  opts.mb = props.mb2
  opts.alreadyCount = mb2AlreadyWorkload
  console.time('second')
  const analysis2 = await simulateSchemasAbortable(opts) as FullAnalysisResult
  console.timeEnd('second')
  if (analysis2)
    emits('result', { analysis1, analysis2 })
})

vue.onUnmounted(() => {
  opts.shouldAbort = true
})
</script>

<template>
  <div class="fit flex flex-center q-pa-xl">
    <div class="col">
      <QLinearProgress stripe rounded size="2rem" :value="progress" />
      <div class="text-center text-grey-6 q-py-md text-spacing">
        计算中 <QSpinnerDots size="1.5rem" />
      </div>
    </div>
  </div>
</template>
