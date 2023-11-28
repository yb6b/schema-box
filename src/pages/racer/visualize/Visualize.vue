<script setup lang="ts">
import type { Schema } from 'libs/schema'
import { onMounted, ref, watch } from 'vue'
import { mdiClose } from '@quasar/extras/mdi-v7'
import { titleRef } from 'libs/utils'
import { simulateSchema } from 'libs/evaluate/simulator'

const p = defineProps<{
  article: {
    name: string
    content: string
  }
  dict: Schema
}>()

titleRef.value = '计算结果'

const resultRef = ref()

onMounted(() => {
  if (process.env.DEV)
    console.time(`计算方案${p.dict.cfg?.name}用时`)

  resultRef.value = simulateSchema(p.dict, p.article.content)

  if (process.env.DEV)
    console.timeEnd(`计算方案${p.dict.cfg?.name}用时`)
})
</script>

<template>
  <QCard class="window-height">
    <QBar>
      <span class="q-ml-lg text-overline text-blue-grey-9">赛码结果</span>
      <QSpace />
      <QBtn v-close-popup flat :icon="mdiClose">
        <QTooltip class="q-px-md" self="center middle" :offset="[0, 25]">
          返回
        </QTooltip>
      </QBtn>
    </QBar>
    <QCardSection class="q-pt-xl row flex-center">
      <pre>{{ JSON.stringify(resultRef, undefined, 2) }}</pre>
    </QCardSection>
  </QCard>
</template>
