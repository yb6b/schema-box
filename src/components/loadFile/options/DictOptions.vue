<script setup lang="ts">
import type { Ref } from 'vue'
import { inject, ref } from 'vue'
import { nanoid6 } from 'libs/utils'
import type { LoadFileResult } from '../LoadFile.vue'

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
  icon: string
}
const dictFormats: DictFormat[] = [
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

const res = inject('result') as Ref<LoadFileResult>

if (!res.value.option)
  res.value.option = {}
res.value.option.plat = 'auto'
res.value.option.selectKeys = ''
res.value.option.cmLen = 4
if (!res.value.option.name)
  res.value.option.name = `码表_${nanoid6()}`
</script>

<template>
  <div class="column q-gutter-sm">
    <QInput
      v-model="res.option!.name"
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
        res.option!.plat = v.value;
        tmpFormat = v
      }"
    >
      <template #option="scope">
        <QItem v-bind="scope.itemProps">
          <QItemSection avatar>
            <QIcon size="xs" :name="`img:${scope.opt.icon}`" />
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
      v-model.number="res.option!.cmLen"
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
