<script setup lang="ts">
import type { Schema } from 'libs/schema'
import { computed, provide, readonly, ref } from 'vue'
import { mdiClose, mdiHandFrontRightOutline, mdiSpeedometer } from '@quasar/extras/mdi-v7'
import { useSetTitle } from 'libs/hooks'
import { simulateSchema } from 'libs/evaluate/simulator'
import Feeling from './Feeling.vue'
import Efficient from './Efficient.vue'
import type { SchemaAndResult } from './share.ts'

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

const resultRef = computed(() => simulateSchema(p.schema, p.article.content))

const result2Ref = computed(() => simulateSchema(p.schema2, p.article.content))

// 其他子组件都通过依赖注入获取所需的资源

provide('result', readonly(resultRef.value))
provide('result2', readonly(result2Ref.value))
provide('schema', readonly(p.schema))
provide('schema2', readonly(p.schema2))
provide('article', readonly(p.article))
provide('SchRes', readonly({ schema: p.schema, result: resultRef.value } as SchemaAndResult))
provide('SchRes2', readonly({ schema: p.schema2, result: result2Ref.value } as SchemaAndResult))

const tabRef = ref('feeling')
</script>

<template>
  <QCard>
    <QBar>
      <QSpace />
      <span class="text-overline text-blue-grey-9 text-truncate" style="overflow: hidden;max-width: calc(99vw - 6rem)">{{ title }}</span>
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
        transition-next="slide-right"
        transition-prev="slide-left"
        class="container-lg"
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
