<script setup lang="ts">
/** 测评一个码表 */
import { mdiClose } from '@quasar/extras/mdi-v7'
import type { Mabiao } from 'libs/schema'
import { ref } from 'vue'
import { useSetTitle } from 'libs/hooks'
import EvaluateZi from './Single.vue'
import EvaluateWords from './Words.vue'
import EvaluateMabiao from './Mabiao.vue'

defineProps<{
  mabiao: Mabiao
}>()

const title = '方案测评'
useSetTitle(title)
const tabRef = ref('zi')
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
        <QTab name="mb" label="码表信息" />
        <QTab name="zi" label="字频测评" />
        <QTab name="wd" label="组词测评" />
      </QTabs>
      <QSeparator />
      <QTabPanels
        v-model="tabRef"
        animated
        transition-next="slide-right"
        transition-prev="slide-left"
        class="container-lg"
      >
        <QTabPanel name="zi">
          <EvaluateZi :mabiao="mabiao" />
        </QTabPanel>
        <QTabPanel name="wd">
          <EvaluateWords />
        </QTabPanel>
        <QTabPanel name="mb">
          <EvaluateMabiao />
        </QTabPanel>
      </QTabPanels>
    </QCardSection>
  </QCard>
</template>
