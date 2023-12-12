<script setup lang="ts">
import type { Ref } from 'vue'
import { inject, ref } from 'vue'
import { nanoid6 } from 'libs/utils'
import type { Schema } from 'libs/schema'
import { mdiLightbulbQuestionOutline } from '@quasar/extras/mdi-v7'

// import { mdiPalette, mdiStarBox } from '@quasar/extras/mdi-v7'

// @ts-expect-error picture
import JisuPng from './assets/jisu.png'

// @ts-expect-error picture
import RimePng from './assets/rime.png'

// @ts-expect-error picture
import YongPng from './assets/yong.png'

interface DictFormat {
  label: string
  value: string
  icon?: string
  mdi?: string
}
const dictFormats: DictFormat[] = [
  {
    label: '自动判断',
    value: 'auto',
    mdi: mdiLightbulbQuestionOutline,
  },
  {
    label: '极速赛码表',
    value: 'jisu',
    icon: JisuPng,
  },
  {
    label: 'Rime / 多多',
    value: 'rime',
    icon: RimePng,
  },
  {
    label: '小小 / 极点',
    value: 'yong',
    icon: YongPng,
  },
]
const tmpFormat = ref(dictFormats[1])

const res = inject('result') as Ref<Schema>

if (!res.value.cfg.raw) {
  res.value.cfg.plat = 'auto'
  res.value.cfg.selectKeys = ' 23456789'
  res.value.cfg.cmLen = 4
  res.value.cfg.name = `码表_${nanoid6()}`
}
</script>

<template>
  <div class="column q-gutter-sm">
    <QInput
      v-model="res.cfg.name"
      class="col"
      label="码表名称"
      stack-label
      placeholder="请输入名称"
    />
    <QSelect
      class="col"
      label="码表格式"
      stack-label
      :options="dictFormats"
      options-dense
      :model-value="tmpFormat"
      @update:model-value="v => {
        res.cfg.plat = v.value;
        tmpFormat = v
      }"
    >
      <template #option="scope">
        <QItem v-bind="scope.itemProps">
          <QItemSection avatar>
            <QIcon v-if="scope.opt.icon" size="xs" :name="`img:${scope.opt.icon}`" />
            <QIcon v-if="scope.opt.mdi" size="xs" :name="scope.opt.mdi" />
          </QItemSection>
          <QItemSection>
            <QItemLabel>
              {{ scope.opt.label }}
            </QItemLabel>
          </QItemSection>
        </QItem>
      </template>
    </QSelect>
    <QInput
      v-model.number="res.cfg.cmLen"
      class="col"
      type="number"
      label="顶屏码长"
      stack-label
    />

    <!-- <div class="row q-gutter-md">
      <q-btn class="col" flat label="主题色" :icon="mdiPalette">
                &emsp;
        <q-badge rounded :style="{ backgroundColor: dictOptions.color }" label=" " />
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-color v-model="dictOptions.color" />
        </q-popup-proxy>
      </q-btn>
      <q-btn class="col" flat label="收藏码表" :icon="mdiStarBox" />
    </div> -->
  </div>
</template>
