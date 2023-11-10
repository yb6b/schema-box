<script setup lang="ts">
import type { Schema } from 'libs/schema'
import { onMounted, ref, watch } from 'vue'
import { mdiClose } from '@quasar/extras/mdi-v7'
import { titleRef } from 'libs/utils'
import { calcSchema } from 'libs/racer'

const p = defineProps<{
  dialog: boolean
  article: {
    name: string
    content: string
  }
  dict: Schema
}>()

const e = defineEmits<{
  'update:dialog': [v: boolean]
}>()

const openDialogRef = ref(false)

watch(() => p.dialog, (d) => {
  openDialogRef.value = d
}, { immediate: true })

const lastTitle = titleRef.value

watch(openDialogRef, (d) => {
  titleRef.value = d ? '赛码结果' : lastTitle
  e('update:dialog', d)
})

const resultRef = ref()
onMounted(() => {
  console.time('calc')
  resultRef.value = calcSchema(p.dict, p.article.content)
  console.timeEnd('calc')
})
</script>

<template>
  <QDialog
    v-model="openDialogRef"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
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
  </QDialog>
</template>
