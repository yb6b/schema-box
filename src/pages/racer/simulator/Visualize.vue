<script setup lang="ts">
import type { Mabiao } from 'libs/schema'
import { provide, ref, shallowRef } from 'vue'

import { useSetTitle } from 'libs/hooks'
import { mdiClose, mdiHandFrontRightOutline, mdiSpeedometer } from '@quasar/extras/mdi-v7'
import type { Result } from './Progress.vue'
import AnalysisProgress from './Progress.vue'

import Feeling from './Feeling.vue'
import Efficient from './Efficient.vue'
import type { AllSimulatorInfo, ArticleInfo } from './inject'

const p = defineProps<{
  article: ArticleInfo
  mb: Mabiao
  mb2: Mabiao
}>()

const title = `《${p.mb?.name}》和《${p.mb2?.name}》赛码结果`
useSetTitle(title)

const resultRef = shallowRef<AllSimulatorInfo>()

function onProgressResult(rs: Result) {
  resultRef.value = {
    art: p.article,
    mb: {
      mb: p.mb,
      analysis: rs.analysis1,
    },
    mb2: {
      mb: p.mb2,
      analysis: rs.analysis2,
    },
  }
}

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
    <AnalysisProgress
      v-if="!resultRef"
      :article="article.txt"
      :mb="mb"
      :mb2="mb2"
      @result="onProgressResult"
    />
    <QCardSection v-else class="q-px-lg">
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
          <Feeling :all-info="resultRef" />
        </QTabPanel>
        <QTabPanel name="efficient">
          <Efficient :all-info="resultRef" />
        </QTabPanel>
      </QTabPanels>
    </QCardSection>
  </QCard>
</template>
