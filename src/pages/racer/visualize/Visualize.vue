<script setup lang="ts">
import type { Schema } from 'libs/schema'
import { computed, provide, readonly, ref } from 'vue'
import { mdiClose, mdiHandFrontRightOutline, mdiSpeedometer } from '@quasar/extras/mdi-v7'
import { useSetTitle } from 'libs/hooks'
import { simulateSchema } from 'libs/evaluate/simulator'
import Feeling from './Feeling.vue'
import Efficient from './Efficient.vue'

const p = defineProps<{
  article: {
    name: string
    content: string
  }
  schema: Schema
  schema2: Schema
}>()

const title = `《${p.schema.cfg?.name}》和《${p.schema2.cfg?.name}》赛码结果`
useSetTitle(title)

if (process.env.DEV)
  console.time(`计算方案《${p.schema.cfg?.name}》用时`)

const resultRef = computed(() => simulateSchema(p.schema, p.article.content))

if (process.env.DEV)
  console.timeEnd(`计算方案《${p.schema.cfg?.name}》用时`)

if (process.env.DEV)
  console.time(`计算方案《${p.schema2.cfg?.name}》用时`)

const result2Ref = computed(() => simulateSchema(p.schema2, p.article.content))

if (process.env.DEV)
  console.timeEnd(`计算方案《${p.schema2.cfg?.name}》用时`)

// 其他子组件都通过依赖注入获取所需的资源

provide('result', readonly(resultRef.value))
provide('result2', readonly(result2Ref.value))
provide('schema', readonly(p.schema))
provide('schema2', readonly(p.schema2))
provide('article', readonly(p.article))

const tabRef = ref('feeling')
</script>

<template>
  <QCard>
    <QBar>
      <QSpace />
      <span class="text-overline text-blue-grey-9">{{ title }}</span>
      <QSpace />
      <QBtn v-close-popup round flat :icon="mdiClose">
        <QTooltip self="center middle" :offset="[0, 25]">
          返回
        </QTooltip>
      </QBtn>
    </QBar>
    <QCardSection class="q-px-lg">
      <QTabs v-model="tabRef" active-color="primary" class="text-blue-grey-8" inline-label>
        <QTab name="efficient" label="效率" :icon="mdiSpeedometer" />
        <QTab name="feeling" label="手感" :icon="mdiHandFrontRightOutline" />
      </QTabs>
      <QSeparator />
      <QTabPanels
        v-model="tabRef"
        animated
      >
        <QTabPanel name="feeling">
          <Feeling />
        </QTabPanel>
        <QTabPanel name="efficient">
          <Efficient />
        </QTabPanel>
      </QTabPanels>
    </QCardSection>
  </QCard>
</template>
