<script setup lang="ts">
import { reactive, ref, toValue, watch, watchEffect } from 'vue'

// import { mdiPalette, mdiStarBox } from '@quasar/extras/mdi-v7'
import JisuPng from './assets/jisu.png'
import RimePng from './assets/rime.png'
import YongPng from './assets/yong.png'

const e = defineEmits<{
  value: [v: ResultOptions]
}>()

type AllDictFormats = 'jisu' | 'rime' | 'yong'

export interface ResultOptions {
  name: string
  format: AllDictFormats
  cl: number
}

const dictFormats: { label: string; value: AllDictFormats;icon: string }[] = [
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
const tmpFormat = ref(dictFormats[0])

const dictOptions = reactive<ResultOptions>({
  name: '',
  format: '',
  cl: 4,
})

watchEffect(() => {
  e('value', { ...dictOptions })
})
</script>

<template>
  <div class="column q-gutter-md">
    <QInput
      v-model="dictOptions.name"
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
        dictOptions.format = v.value;
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
      v-model.number="dictOptions.cl"
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
