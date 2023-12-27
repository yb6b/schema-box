<script setup lang="ts">
import type { Mabiao } from 'libs/schema'
import { type EvaluateItems, calcWeightedEvalItems, quickEvaluate, zipEvaluationItems } from 'libs/evaluate/hanzi'
import type { QTableProps } from 'quasar'
import { ref, shallowRef } from 'vue'
import SingleNormalRow from './SingleNormalRow.vue'
import SingleSumRow from './SingleSumRow.vue'

/** 测评单字性能，即科学形码测评系统 */
const props = defineProps<{
  mabiao: Mabiao
}>()

const result = quickEvaluate(props.mabiao)
const resultSum1 = zipEvaluationItems(result.slice(0, 3))
const weightedEvalItems1 = calcWeightedEvalItems(resultSum1)
const resultSum2 = zipEvaluationItems(result.slice(0, 5))
const weightedEvalItems2 = calcWeightedEvalItems(resultSum2)

const openDrawer = shallowRef(false)
const drawerTableRef = shallowRef<{
  title: QTableProps['title']
  columns: QTableProps['columns']
  rows: QTableProps['rows']
}>()

const pagination = ref({ rowsPerPage: 20 })

const itemsName = ['1~300', '301~500', '501~1500', '1501~3000', '3001~6000']
const itemsName2 = ['1501~3000', '3001~6000']
</script>

<template>
  <div class="columns justify-center">
    <QMarkupTable separator="horizontal" bordered dense class="sticky-first-column-table">
      <thead class="bg-teal-2 text-grey-10">
        <tr>
          <td class="text-right bg-teal-1 ">
            统计范围
          </td>
          <td>1 码</td>
          <td>2 码</td>
          <td>3 码</td>
          <td>4 码</td>
          <td class="text-red-8">
            选重
          </td>
          <td class="text-red-8">
            理论二简
          </td>
          <td>加权键长</td>
          <td>加权字均当量</td>
          <td>加权键均当量</td>
          <td>左右互击</td>
          <td>同指大跨排</td>
          <td>同指小跨排</td>
          <td>小指干扰</td>
          <td>错手</td>
          <td>三连击</td>
          <td>超标键位</td>
          <td>缺字标记</td>
        </tr>
      </thead>
      <tbody>
        <SingleNormalRow
          v-for="i in 3"
          :key="i"
          :range-label="itemsName[i - 1]"
          :mb-name="mabiao.name!"
          :eva-item="result[i - 1]"
          @click="v => { drawerTableRef = v; openDrawer = true }"
        />

        <SingleNormalRow
          range-label="1~1500"
          index-label="小计"
          class="bg-teal-1"
          :mb-name="mabiao.name!"
          :eva-item="resultSum1"
          @click="v => { drawerTableRef = v; openDrawer = true }"
        />
        <SingleSumRow
          class="bg-teal-1"
          index-label="加权比重"
          :eva-item="weightedEvalItems1"
        />

        <SingleNormalRow
          v-for="i in 2"
          :key="i"
          :range-label="itemsName2[i - 1]"
          :mb-name="mabiao.name!"
          :eva-item="result[i + 2]"
          @click="v => { drawerTableRef = v; openDrawer = true }"
        />

        <SingleNormalRow
          range-label="1~6000"
          index-label="总计"
          class="bg-teal-1"
          :mb-name="mabiao.name!"
          :eva-item="resultSum2"
          @click="v => { drawerTableRef = v; openDrawer = true }"
        />

        <SingleSumRow
          class="bg-teal-1"
          index-label="加权比重"
          :eva-item="weightedEvalItems2"
        />
      </tbody>
    </QMarkupTable>
  </div>

  <!-- 详细列表 -->
  <QDrawer v-model="openDrawer" show-if-above :width="400" elevated>
    <QScrollArea class="fit q-pa-md">
      <QTable
        v-model:pagination="pagination"
        dense
        title-class="text-truncate text-center text-blue-grey-9 text-body1"
        v-bind="drawerTableRef"
        row-key="index"
        :rows-per-page-options="[20, 50, 100]"
      />
    </QScrollArea>
  </QDrawer>
</template>
