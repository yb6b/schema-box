<script setup lang="ts">
import type { TableRef } from './types'
import SingleNormalRow from './tab-single-normal-row.vue'
import SingleSumRow from './tab-single-sum-row.vue'
import { wordsActions } from './evaluation-actions'
import type { Mabiao } from '@/libs/schema'
import { quickEvaluateWords, zipEvaluationItems } from '@/libs/evaluate/hanzi'
import KbdHeat from '@/components/plot/keyboard-heatmap.vue'
import InfoTooltip from '@/components/custom/tooltip-container.vue'

/** 测评组词的性能 */
// 设置造词的格式 select
// 6w 词语 选重 加权词均当量 左右互击 大跨 小跨 小指干扰 错手 三连击 超标 缺词
//

/** 测评单字性能，即科学形码测评系统 */
const props = defineProps<{
  mabiao: Mabiao
}>()

defineEmits<{
  table: [data: TableRef]
}>()

const { evaluateResult, usage } = quickEvaluateWords(props.mabiao)

const resultSum1 = zipEvaluationItems(evaluateResult.slice(0, 3))
const resultSum2 = zipEvaluationItems(evaluateResult)
</script>

<template>
  <div class="column items-center">
    <QMarkupTable separator="horizontal" bordered dense class="sticky-first-column-table full-width col">
      <thead class="bg-green-2 text-grey-10 text-right">
        <!-- 表格头 -->
        <tr>
          <td class="text-right bg-green-2">
            统计范围
          </td>
          <td v-for="action in wordsActions" :key="action.zhName">
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
          :evaluate-result="evaluateResult[i - 1]"
          color="bg-green-1"
          :actions="wordsActions"
          @click="v => $emit('table', v)"
        />

        <SingleNormalRow
          index-label="小计"
          class="bg-green-1"
          color="bg-green-1"
          :mb="mabiao"
          :evaluate-result="resultSum1"
          :actions="wordsActions"
          @click="v => $emit('table', v)"
        />
        <SingleSumRow
          :actions="wordsActions"
          color="bg-green-1"
          class="bg-green-1"
          index-label="加权比重"
          :evaluate-result="resultSum1"
        />

        <SingleNormalRow
          v-for="i in 3"
          :key="i"
          :mb="mabiao"
          :evaluate-result="evaluateResult[i + 2]"
          color="bg-green-1"
          :actions="wordsActions"
          @click="v => $emit('table', v)"
        />

        <SingleNormalRow
          index-label="总计"
          class="bg-green-1"
          color="bg-green-1"
          :mb="mabiao"
          :evaluate-result="resultSum2"
          :actions="wordsActions"
          @click="v => $emit('table', v)"
        />

        <SingleSumRow
          :actions="wordsActions"
          color="bg-green-1"
          class="bg-green-1"
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
