<script setup lang="ts">
import type { Ref } from 'vue'
import { ref, watch, watchEffect } from 'vue'
import { mdiClipboardOutline, mdiContentCopy, mdiFileDocument, mdiFolderOpen } from '@quasar/extras/mdi-v7'
import { useDebounceFn } from '@vueuse/core'

const p = defineProps<{
  dictMode?: boolean
}>()

const e = defineEmits<{
  (e: 'load', content: string): void
}>()

const name = p.dictMode ? '码表' : '文章'

type SelectSource = 'upload' | 'clipboard' | 'textarea' | 'preset'

interface SelectOption {
  label: string
  value: SelectSource
  icon: string
  dsc: string
}
const selectOptions: SelectOption[] = [
  { label: '打开文件', value: 'upload', icon: mdiFileDocument, dsc: '打开本地文件' },
  { label: '粘贴', value: 'textarea', icon: mdiContentCopy, dsc: '手动粘贴，可能卡顿' },
  { label: '系统剪贴板', value: 'clipboard', icon: mdiClipboardOutline, dsc: '一键读取剪切板，性能好，但要权限' },
  //  { label: '预置方案', value: 'presets', icon: mdiViewDashboardOutline, dsc: '预装的20种方案' },
]
const selectSource = ref(selectOptions[0])
const content = ref('')

watch(selectSource, () => {
  content.value = ''
})

watch([content], useDebounceFn(() => {
  e('load', content.value)
}, 200))

const file: Ref<File | null> = ref(null)

watchEffect(async () => {
  if (file.value)
    content.value = await file.value.text()
})

function readClipboard() {
  (async () => {
    const text = await navigator.clipboard.readText()
    content.value = text
  })()
}
</script>

<template>
  <div>
    <div class="coloumn q-gutter-sm q-mb-lg">
      <div class="col">
        {{ name }}数据来源
      </div>

      <q-select
        v-model="selectSource"
        class="col"
        :options="selectOptions"
        outlined
        dense
      >
        <template #option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <q-icon :name="scope.opt.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
              <q-item-label caption>
                {{ scope.opt.dsc }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div v-if="selectSource.value === 'upload'">
      <q-file
        v-model="file"
        filled
        dense
        class="col"
        label="打开本地文件"
        bottom-slots
      >
        <template #before>
          <q-icon :name="mdiFolderOpen" />
        </template>
      </q-file>
    </div>

    <div v-else-if="selectSource.value === 'clipboard'" class="col justify-center">
      <q-btn
        class="col"
        push
        rounded
        color="secondary"
        label="读取剪切板"
        @click="readClipboard"
      />
      <div v-show="content" class="q-mt-sm text-grey-6">
        已读取「{{ [...content].slice(0, 8).join("") }}……」 共
        {{ [...content].length }} 字
      </div>
    </div>

    <div v-else-if="selectSource.value === 'textarea'" class="col">
      <q-input
        v-model="content"
        clearable
        autofocus
        outlined
        type="textarea"
        :label="dictMode ? '码表内容' : '文章内容'"
        stack-label
        :placeholder="dictMode ? `粘贴你的码表，如：&#10;a 工 戈&#10;aa 式&#10;……` : '此处粘贴文本'"
      />
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
