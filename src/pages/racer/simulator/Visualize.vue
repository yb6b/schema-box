<script setup lang="ts">
import type { Mabiao } from 'libs/schema'
import { computed, provide, ref } from 'vue'
import { mdiClose, mdiHandFrontRightOutline, mdiSpeedometer } from '@quasar/extras/mdi-v7'
import { useSetTitle } from 'libs/hooks'
import { simulateSchema } from 'libs/evaluate/simulator'
import Feeling from './Feeling.vue'
import Efficient from './Efficient.vue'
import type { ArticleInfo } from './inject'
import { jArticle, jMabiao, jMabiao2, jResult, jResult2 } from './inject'

const p = defineProps<{
  article: ArticleInfo
  mb: Mabiao
  mb2: Mabiao
}>()

const title = `《${p.mb?.name}》和《${p.mb2?.name}》赛码结果`
useSetTitle(title)

const resultRef = computed(() => simulateSchema(p.mb, p.article.txt))

const result2Ref = computed(() => simulateSchema(p.mb2, p.article.txt))

// 其他子组件都通过依赖注入获取所需的资源

provide(jResult, resultRef.value)
provide(jResult2, result2Ref.value)
provide(jMabiao, p.mb)
provide(jMabiao2, p.mb2)
provide(jArticle, p.article)

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
