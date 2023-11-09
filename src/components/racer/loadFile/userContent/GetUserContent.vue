<script setup lang="ts">
import { inject, ref, watch } from 'vue'

import Upload from './Upload.vue'
import Clipboard from './Clipboard.vue'
import Textarea from './Textarea.vue'
import { selectOptions } from './source'

const e = defineEmits<{
  (e: 'value', content: string): void
}>()

const dictMode = inject('dictMode')

const selectSource = ref(selectOptions[0])
const content = ref('')

watch(selectSource, () => {
  // 切换类型后，清空内容。避免textarea卡顿
  content.value = ''
})

watch([content], () => {
  // 内容改动后，立即触发emit
  e('value', content.value)
})
</script>

<template>
  <div>
    <div class="coloumn q-gutter-sm q-mb-lg">
      <div class="col">
        {{ dictMode ? '码表' : '文章' }}数据来源
      </div>

      <QSelect
        v-model="selectSource"
        class="col"
        :options="selectOptions"
        outlined
        dense
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
    </div>
    <div v-if="selectSource.value === 'upload'">
      <Upload @value="v => content = v" />
    </div>

    <div v-else-if="selectSource.value === 'clipboard'" class="">
      <Clipboard @value="v => content = v" />
    </div>

    <div v-else-if="selectSource.value === 'textarea'" class="col">
      <Textarea v-model="content" />
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
