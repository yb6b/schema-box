<script setup lang="ts">
import { inject, onMounted, shallowRef } from 'vue'
import { nanoid6 } from 'libs/utils'
import { mdiLightbulbQuestionOutline } from '@quasar/extras/mdi-v7'
import type { PlatTypes } from 'libs/platforms'
import { detectPlatAuto } from 'libs/platforms'
import { detectPlatform } from 'libs/platforms/detectPlat'
import { RawFile } from 'src/libs/platforms/rawFile'
import { jResultRef } from '../inject'

// import { mdiPalette, mdiStarBox } from '@quasar/extras/mdi-v7'

// @ts-expect-error picture
import JisuPng from './assets/jisu.png'

// @ts-expect-error picture
import RimePng from './assets/rime.png'

// @ts-expect-error picture
import YongPng from './assets/yong.png'

// @ts-expect-error picture
import DuoduoJpg from './assets/duoduo.jpg'

interface DictFormat {
  label: string
  value: PlatTypes
  icon: string
}

const dictFormats: DictFormat[] = [
  {
    label: '通用码表',
    value: 'auto',
    icon: mdiLightbulbQuestionOutline,
  },
  // {
  //   label: '极速赛码表',
  //   value: 'jisu',
  //   icon: `img:${JisuPng}`,
  // },
  {
    label: 'Rime',
    value: 'rime',
    icon: `img:${RimePng}`,
  },
  {
    label: '多多',
    value: 'duoduo',
    icon: `img:${DuoduoJpg}`,
  },
  {
    label: '小小',
    value: 'yong',
    icon: `img:${YongPng}`,
  },
]
const tmpFormat = shallowRef(dictFormats[0])

const res = inject(jResultRef) !

onMounted(() => {
  const raw = res.value.raw || new RawFile(res.value.txt!)
  detectPlatform(raw).then((resultType) => {
    // 找不到确定的格式, 则只能选择 auto
    if (resultType === null)
      return
    const formatItem = dictFormats.find(v => v.value === resultType)
    // 防错, 找不到的话, 用通用规则
    if (!formatItem)
      return
    res.value.plat = resultType
    tmpFormat.value = formatItem
  })
})

if (!res.value.name)
  res.value.name = `码表_${nanoid6()}`

if (!res.value.plat)
  res.value.plat = 'auto'

if (!res.value.selectKeys)
  res.value.selectKeys = ' 23456789'

if (!res.value.cmLen)
  res.value.cmLen = 4
</script>

<template>
  <div class="column q-gutter-sm">
    <QInput
      v-model="res.name"
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
        res.plat = v.value;
        tmpFormat = v
      }"
    >
      <template #option="scope">
        <QItem v-bind="scope.itemProps">
          <QItemSection avatar>
            <QIcon size="xs" :name="scope.opt.icon" />
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
      v-model.number="res.cmLen"
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
