<script setup lang="ts">
/** 测评一个码表 */
import { mdiClose } from '@quasar/extras/mdi-v7'
import { defineAsyncComponent, onErrorCaptured, ref, shallowRef, watch } from 'vue'
import { useQuasar } from 'quasar'
import type { TableRef } from './types'
import type { Mabiao } from '@/libs/schema'
import { useSetTitle } from '@/libs/hooks'
import { useEvaluateStore } from '@/stores/evaluate-store'

import { writeStringToClipboard } from '@/libs/utils'
import InfoTooltip from '@/components/custom/tooltip-container.vue'
import LoadSpinner from '@/components/custom/spinner-loading.vue'

const p = defineProps<{
  mabiao: Mabiao
}>()
const EvaluateZi = defineAsyncComponent(() => import('./tab-single.vue'))
const EvaluateWords = defineAsyncComponent(() => import('./tab-words.vue'))
const EvaluateMabiao = defineAsyncComponent(() => import('./tab-mabiao.vue'))

const title = `${p.mabiao.name}方案测评`
useSetTitle(title)
const tabRef = ref('zi')

const openTableDialog = shallowRef(false)

const tableRef = shallowRef<TableRef>()

const evaluateStore = useEvaluateStore()
const pagination = ref({ rowsPerPage: evaluateStore.pagination.rowsPerPage, page: 1 })
watch(() => pagination.value.rowsPerPage, () => {
  evaluateStore.setRowsPer(pagination.value.rowsPerPage)
})

function getTsv(data: TableRef) {
  if (!data.columns || !data.rows)
    return ''
  const format = (v: number | string) => typeof v === 'number' && v < 1 && v > 0 ? v.toFixed(8) : v
  // 标题行
  let rs = data.columns.map(v => v.label).join('\t')
  for (const e of data.rows)
    rs += `\n${data.columns.map(v => format(e[v.field as string])).join('\t')}`
  return rs
}

function onTable(table: TableRef) {
  pagination.value.page = 1
  tableRef.value = table
  openTableDialog.value = true
}

const $q = useQuasar()
onErrorCaptured((err) => {
  $q.notify({ type: 'negative', message: err.message })
})
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
        keep-alive
        class="container-lg"
      >
        <QTabPanel name="mb">
          <div class="column flex-center">
            <div class="q-pa-sm">
              <Suspense :timeout="200">
                <EvaluateMabiao :mabiao="mabiao" @table="onTable" />
                <template #fallback>
                  <LoadSpinner label="加载中……" />
                </template>
              </Suspense>
            </div>
          </div>
        </QTabPanel>
        <QTabPanel name="zi">
          <Suspense :timeout="200">
            <EvaluateZi :mabiao="mabiao" @table="onTable" />
            <template #fallback>
              <LoadSpinner label="加载字频表………" />
            </template>
          </Suspense>
        </QTabPanel>
        <QTabPanel name="wd">
          <Suspense :timeout="200">
            <EvaluateWords :mabiao="mabiao" @table="onTable" />
            <template #fallback>
              <LoadSpinner label="加载词频数据……" />
            </template>
          </Suspense>
        </QTabPanel>
      </QTabPanels>
    </QCardSection>
  </QCard>
  <!-- 详细列表 -->
  <QDialog v-model="openTableDialog">
    <QCard>
      <div class="overflow-auto" style="max-height: min(30rem,80vh);">
        <QTable
          v-model:pagination="pagination"
          flat
          dense
          title-class="text-truncate text-center text-blue-grey-9 text-body1"
          v-bind="tableRef"
          row-key="index"
          :rows-per-page-options="[20, 50, 100]"
        />
      </div>

      <QSeparator />
      <QCardActions align="right">
        <QBtn
          label="复制数据" flat @click="async (e) => {
            const txt = getTsv(tableRef!)
            await writeStringToClipboard(txt)
            $q.notify({ type: 'success', message: `已写入${tableRef?.rows?.length}行表格到系统剪切板` })
          }"
        >
          <InfoTooltip><p>复制上文的表格为TSV格式的纯文本。</p>你可以在其他文本编辑器、Excel、通讯软件里粘贴TSV数据。</InfoTooltip>
        </QBtn>
        <QBtn label="关闭" flat color="primary" @click="e => openTableDialog = false" />
      </QCardActions>
    </QCard>
  </QDialog>
</template>
