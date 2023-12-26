<script setup lang="ts">
import { inject, onMounted, onUnmounted, shallowRef, toValue, watch } from 'vue'
import { nanoid6 } from 'libs/utils'
import { mdiLightbulbQuestionOutline } from '@quasar/extras/mdi-v7'
import type { PlatTypes } from 'libs/platforms'
import { detectAndFillMabiao, loadPlatAutoDirectly, platToLoader, platToName } from 'libs/platforms'
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
const valueToDictFormat = Object.fromEntries(dictFormats.map(v => [v.value, v]))
const tmpFormat = shallowRef(dictFormats[0])

const res = inject(jResultRef) !

// 初始化参数
if (!res.value.name)
  res.value.name = `码表_${nanoid6()}`
if (!res.value.plat)
  res.value.plat = 'auto'
if (!res.value.selectKeys)
  res.value.selectKeys = ' 23456789'
if (!res.value.cmLen)
  res.value.cmLen = 4

let stopWatchPlat: Function
onMounted(() => {
  // 如果已经存在码表数据了, 是preset组件属性传来的, 可以跳过推断
  if (res.value.items.length === 0) {
    let raw = res.value.raw || new RawFile(res.value.txt!)
    raw = toValue(raw)
    // 分析码表 格式
    detectAndFillMabiao(raw).then((mb) => {
      res.value.items = mb.items
      res.value.name = mb.name
      res.value.plat = mb.plat
      tmpFormat.value = valueToDictFormat[mb.plat!]
      res.value.selectKeys = mb.selectKeys
      res.value.cmLen = mb.cmLen
    })
  }
  stopWatchPlat = watch(() => res.value.plat, async (plat, oldplat) => {
    try {
      if (plat === 'auto') {
        const mb = await loadPlatAutoDirectly(res.value.raw!)
        res.value.items = mb.items
        return
      }
      const loader = platToLoader[plat!]
      const mb = await loader(res.value.raw!)
      res.value.items = mb.items
    }
    catch (error) {
      if (error instanceof Error) {
        res.value.plat = oldplat
        tmpFormat.value = valueToDictFormat[oldplat!]
        throw new Error(`码表${res.value.name}无法解析成${platToName[plat!]}格式。因为：${error.message}`)
      }
    }
  })
})

onUnmounted(() => {
  stopWatchPlat()
})
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
