<script setup lang="ts">
/** 测评一个码表 */
import { mdiClose } from '@quasar/extras/mdi-v7'
import type { Mabiao } from 'libs/schema'
import { ref, shallowRef } from 'vue'
import { useSetTitle } from 'libs/hooks'

import { writeStringToClipboard } from 'libs/utils'
import InfoTooltip from 'components/custom/InfoTooltip.vue'
import EvaluateZi from './Single.vue'
import EvaluateWords from './Words.vue'
import EvaluateMabiao from './Mabiao.vue'
import type { TableRef } from './types'

const p = defineProps<{
  mabiao: Mabiao
}>()

const title = `${p.mabiao.name}方案测评`
useSetTitle(title)
const tabRef = ref('zi')

const openTableDialog = shallowRef(false)

const tableRef = shallowRef<TableRef>()

const pagination = ref({ rowsPerPage: 20 })

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
  tableRef.value = table
  openTableDialog.value = true
}
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
        <QTabPanel name="zi">
          <EvaluateZi :mabiao="mabiao" @table="onTable" />
        </QTabPanel>
        <QTabPanel name="wd">
          <EvaluateWords :mabiao="mabiao" @table="onTable" />
        </QTabPanel>
        <QTabPanel name="mb">
          <EvaluateMabiao />
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
