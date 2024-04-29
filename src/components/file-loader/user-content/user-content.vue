<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import { mdiClipboardOutline, mdiContentCopy, mdiFileDocument } from '@quasar/extras/mdi-v7'

import { jDictMode, jResultRef } from '../inject'
import Upload from './load-upload.vue'
import Clipboard from './load-clipboard.vue'
import TextareaContent from './load-textarea.vue'

const dictMode = inject(jDictMode)!
const res = inject(jResultRef)!

interface SelectOption {
  label: string
  value: 'upload' | 'clipboard' | 'textarea' | 'preset'
  icon: string
  dsc: string
}

const selectOptions: SelectOption[] = [
  { label: '本地文件', value: 'upload', icon: mdiFileDocument, dsc: '打开本地文件' },
  { label: '系统剪贴板', value: 'clipboard', icon: mdiClipboardOutline, dsc: '一键读取剪切板，性能好' },
  { label: '粘贴', value: 'textarea', icon: mdiContentCopy, dsc: '手动粘贴，可能卡顿' },
  //  { label: '预置方案', value: 'presets', icon: mdiViewDashboardOutline, dsc: '预装的20种方案' },
]

const selectOptRef = ref(selectOptions[0])
watch(selectOptRef, () => {
  res.value.txt = ''
  res.value.raw = undefined
})
</script>

<template>
  <div>
    <QSelect
      v-model="selectOptRef"
      class="q-mb-lg"
      :options="selectOptions"
      square
      filled
      :label="`${dictMode ? '码表' : '文章'}数据来源`"
    >
      <template #option="scope">
        <QItem v-bind="scope.itemProps">
          <QItemSection avatar>
            <QIcon :name="scope.opt.icon" />
          </QItemSection>
          <QItemSection>
            <QItemLabel>{{ scope.opt.label }}</QItemLabel>
            <QItemLabel caption>
              {{ scope.opt.dsc }}
            </QItemLabel>
          </QItemSection>
        </QItem>
      </template>
    </QSelect>

    <div v-if="selectOptRef.value === 'upload'">
      <Upload />
    </div>

    <div v-else-if="selectOptRef.value === 'clipboard'">
      <Clipboard />
    </div>

    <div v-else-if="selectOptRef.value === 'textarea'" class="col">
      <TextareaContent />
    </div>

    <!-- <div v-else-if="selectSource.value === 'preset'">
      <q-select
        v-model="chosedPreset"
        label="选择预置方案"
        options-dense
        :options="allPresets"
      />
    </div> -->
  </div>
</template>
