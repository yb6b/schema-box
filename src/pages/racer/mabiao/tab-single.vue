<script setup lang="ts">
import { computed, shallowRef } from 'vue'

import { singleActions } from './evaluation-actions'
import type { TableRef } from './types'
import SingleNormalRow from './tab-single-normal-row.vue'
import SingleSumRow from './tab-single-sum-row.vue'
import UserFreqTsv from './user-freq-tsv.vue'
import KbdHeat from '@/components/plot/keyboard-heatmap.vue'
import InfoTooltip from '@/components/custom/tooltip-container.vue'
import { presetHanziFreq, quickEvaluateHanzi, zipEvaluationItems } from '@/libs/evaluate/hanzi'
import { RawFile } from '@/libs/platforms'
import type { Mabiao } from '@/libs/schema'

/** 测评单字性能，即科学形码测评系统 */
const props = defineProps<{
  mabiao: Mabiao
}>()
defineEmits<{
  table: [data: TableRef]
}>()

const openUserFreqTsvDialog = shallowRef(false)
const isUserFreq = shallowRef(false)

const rawTxt = shallowRef(presetHanziFreq)
const result = computed(() => {
  const evaluateResult = quickEvaluateHanzi(props.mabiao, rawTxt.value)
  const sum1 = zipEvaluationItems(evaluateResult.evaluate.slice(0, 3))
  const sum2 = zipEvaluationItems(evaluateResult.evaluate.slice(0, 5))
  const rs = { ...evaluateResult, sum1, sum2 }
  return rs
})
</script>

<template>
  <div class="column items-center">
    <div v-if="isUserFreq" class="text-h5 q-my-sm text-blue-grey-8 text-spacing">
      自定义字频
    </div>
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
          :evaluate-result="result.evaluate[i - 1]"
          color="bg-teal-1"
          :base-fin-load-rate="result.baseFinLoadRate"
          :actions="singleActions"
          @click="v => $emit('table', v)"
        />

        <SingleNormalRow
          index-label="小计"
          class="bg-teal-1"
          color="bg-teal-1"
          :mb="mabiao"
          :evaluate-result="result.sum1"
          :actions="singleActions"
          :base-fin-load-rate="result.baseFinLoadRate"
          @click="v => $emit('table', v)"
        />
        <SingleSumRow
          :actions="singleActions"
          color="bg-teal-1"
          class="bg-teal-1"
          index-label="加权比重"
          :evaluate-result="result.sum1"
        />

        <SingleNormalRow
          v-for="i in 2"
          :key="i"
          :mb="mabiao"
          :evaluate-result="result.evaluate[i + 2]"
          color="bg-teal-1"
          :base-fin-load-rate="result.baseFinLoadRate"
          :actions="singleActions"
          @click="v => $emit('table', v)"
        />

        <SingleNormalRow
          index-label="总计"
          class="bg-teal-1"
          color="bg-teal-1"
          :mb="mabiao"
          :evaluate-result="result.sum2"
          :actions="singleActions"
          :base-fin-load-rate="result.baseFinLoadRate"
          @click="v => $emit('table', v)"
        />

        <SingleSumRow
          :actions="singleActions"
          color="bg-teal-1"
          class="bg-teal-1"
          index-label="加权比重"
          :evaluate-result="result.sum2"
        />
      </tbody>
    </QMarkupTable>
    <div class="text-h6 q-pt-xl text-blue-grey-8">
      键位热力图（单位：%）
    </div>

    <!-- 键位热图 -->
    <div class="col full-width " style="overflow-x: auto">
      <KbdHeat :key-map="result.usage" />
    </div>
    <!-- 设置 -->
    <div class="col q-py-lg justify-right">
      <QBtn outline rounded color="secondary" @click="e => openUserFreqTsvDialog = true">
        自定义字频表 <QChip v-if="isUserFreq" dense color="secondary" class="text-white">
          已设置
        </QChip>
      </QBtn>
    </div>
  </div>

  <QDialog v-model="openUserFreqTsvDialog">
    <UserFreqTsv
      :length="6000"
      single
      label="自定义字频表"
      @tsv="ct => { rawTxt = ct; openUserFreqTsvDialog = false; isUserFreq = true }"
    >
      <div class="text-grey-9">
        点击打开或拖动文件
        <div class="q-pt-md text-bold">
          文件要求：
        </div>
        <ol>
          <li>
            最少 <b>6000</b> 字的字频数据。
          </li>
          <li>
            每行一个字和它的频数（正整数）。
          </li>
          <li>
            每行的字和频数用 <b>Tab</b> 符分隔。
          </li>
          <li>
            所有按频数从大到小排序好。
          </li>
        </ol>
      </div>
    </UserFreqTsv>
  </QDialog>
</template>
