<script setup lang="ts">
import type { Mabiao } from 'libs/schema'
import { quickEvaluateHanzi, zipEvaluationItems } from 'libs/evaluate/hanzi'
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

const { evaluate, usage, baseFinLoadRate } = quickEvaluateHanzi(props.mabiao)

const resultSum1 = zipEvaluationItems(evaluate.slice(0, 3))
const resultSum2 = zipEvaluationItems(evaluate.slice(0, 5))
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
          :mb="mabiao"
          :evaluate-result="evaluate[i - 1]"
          color="bg-teal-1"
          :base-fin-load-rate="baseFinLoadRate"
          :actions="singleActions"
          @click="v => $emit('table', v)"
        />

        <SingleNormalRow
          index-label="小计"
          class="bg-teal-1"
          color="bg-teal-1"
          :mb="mabiao"
          :evaluate-result="resultSum1"
          :actions="singleActions"
          :base-fin-load-rate="baseFinLoadRate"
          @click="v => $emit('table', v)"
        />
        <SingleSumRow
          :actions="singleActions"
          color="bg-teal-1"
          class="bg-teal-1"
          index-label="加权比重"
          :evaluate-result="resultSum1"
        />

        <SingleNormalRow
          v-for="i in 2"
          :key="i"
          :mb="mabiao"
          :evaluate-result="evaluate[i + 2]"
          color="bg-teal-1"
          :base-fin-load-rate="baseFinLoadRate"
          :actions="singleActions"
          @click="v => $emit('table', v)"
        />

        <SingleNormalRow
          index-label="总计"
          class="bg-teal-1"
          color="bg-teal-1"
          :mb="mabiao"
          :evaluate-result="resultSum2"
          :actions="singleActions"
          :base-fin-load-rate="baseFinLoadRate"
          @click="v => $emit('table', v)"
        />

        <SingleSumRow
          :actions="singleActions"
          color="bg-teal-1"
          class="bg-teal-1"
          index-label="加权比重"
          :evaluate-result="resultSum2"
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
