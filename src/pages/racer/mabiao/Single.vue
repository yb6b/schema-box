<script setup lang="ts">
import type { Mabiao } from 'libs/schema'
import { calcWeightedEvalItems, quickEvaluate, zipEvaluationItems } from 'libs/evaluate/hanzi'
import InfoTooltip from 'components/custom/InfoTooltip.vue'
import KbdHeat from 'components/plot/KbdHeat.vue'
import { singleActions } from './evaluateItemsAction'
import type { TableRef } from './types'
import SingleNormalRow from './SingleNormalRow.vue'
import SingleSumRow from './SingleSumRow.vue'

/** 测评单字性能，即科学形码测评系统 */
const props = defineProps<{
  mabiao: Mabiao
}>()

defineEmits<{
  table: [data: TableRef]
}>()

const { evaluate, usage } = quickEvaluate(props.mabiao)
const resultSum1 = zipEvaluationItems(evaluate.slice(0, 3))
const weightedEvalItems1 = calcWeightedEvalItems(resultSum1)
const resultSum2 = zipEvaluationItems(evaluate.slice(0, 5))
const weightedEvalItems2 = calcWeightedEvalItems(resultSum2)

const itemsName = ['1~300', '301~500', '501~1500', '1501~3000', '3001~6000']
const itemsName2 = ['1501~3000', '3001~6000']
</script>

<template>
  <div class="column items-center">
    <QMarkupTable separator="horizontal" bordered dense class="sticky-first-column-table full-width col">
      <thead class="bg-teal-2 text-grey-10 text-right">
        <!-- 表格头 -->
        <tr>
          <td class="text-right bg-teal-2">
            统计范围
          </td>
          <td v-for="action in singleActions" :key="action.zhName">
            <span v-html="action.headHtml" />
            <InfoTooltip v-if="'headInfoHtml' in action" :no-container="!!action.headInfoHtmlNoContainer">
              <div v-html="action.headInfoHtml" />
            </InfoTooltip>
          </td>
        </tr>
      </thead>
      <tbody>
        <SingleNormalRow
          v-for="i in 3"
          :key="i"
          :range-label="itemsName[i - 1]"
          :mb-name="mabiao.name!"
          :eva-item="evaluate[i - 1]"
          @click="v => $emit('table', v)"
        />

        <SingleNormalRow
          range-label="1~1500"
          index-label="小计"
          class="bg-teal-1"
          :mb-name="mabiao.name!"
          :eva-item="resultSum1"
          @click="v => $emit('table', v)"
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
          :eva-item="evaluate[i + 2]"
          @click="v => $emit('table', v)"
        />

        <SingleNormalRow
          range-label="1~6000"
          index-label="总计"
          class="bg-teal-1"
          :mb-name="mabiao.name!"
          :eva-item="resultSum2"
          @click="v => $emit('table', v)"
        />

        <SingleSumRow
          class="bg-teal-1"
          index-label="加权比重"
          :eva-item="weightedEvalItems2"
        />
      </tbody>
    </QMarkupTable>
    <div class="text-h6 q-pt-xl text-blue-grey-8">
      键位热力图（单位：%）
    </div>

    <!-- 键位热图 -->
    <div class="col full-width " style="overflow-x: auto">
      <KbdHeat :key-map="usage" />
    </div>
  </div>
</template>
