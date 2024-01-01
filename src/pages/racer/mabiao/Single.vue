<script setup lang="ts">
import type { Mabiao } from 'libs/schema'
import { calcWeightedEvalItems, quickEvaluate, totalFreqFromKeysUsages, zipEvaluationItems } from 'libs/evaluate/hanzi'
import InfoTooltip from 'components/custom/InfoTooltip.vue'
import { formatFloat } from 'src/libs/utils'
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

function fmtUsageFreq(key: string) {
  const freq = usage.get(key)

  if (!freq || freq <= 0)
    return ''
  return formatFloat(freq, 2, true)
}
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

    <!-- 键位热图 -->
    <div class="col full-width" style="overflow-x: scroll">
      <div
        class="column items-center q-mt-xl q-gutter-sm"
      >
        <div
          v-for="keyRow in ['1234567890-=', 'qwertyuiop[]', 'asdfghjkl;\' ', 'zxcvbnm,./  ']"
          :key="keyRow" class="col row"
          style="width: 50rem;"
        >
          <div
            v-for="k in keyRow" :key="k"
            class="col sc q-mx-xs non-selectable text-left"
            style="height: 3.7rem; width: 4rem"
          >
            <template v-if="k === ' '">
              <div />
            </template>
            <div
              v-else
              class="q-pa-sm fit"
              style="border: 1px solid #494a4e6d; border-radius: 6px;box-shadow: 0 3px 6px #32333868;"
              :style="{ backgroundColor: `rgba(239,68,68,${(usage.get(k) ?? 0) * 20})` }"
            >
              <div class="text-uppercase text-bold text-grey-9">
                <kbd>{{ k }}</kbd>
              </div>
              <div style="font-size: x-small;" class="text-weight-thin text-right">
                {{ fmtUsageFreq(k) }}
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div
            class="text-center"
            style="width: 18rem; height: 3rem; border: 1px solid #494a4e6d; border-radius: 6px;box-shadow: 0 3px 6px #32333868;"
            :style="{ backgroundColor: `rgba(239,68,68,${(usage.get(' ') ?? 0) * 20})` }"
          >
            空格
            <div style="font-size: x-small;" class="text-weight-thin">
              {{ fmtUsageFreq(' ') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 详细列表 -->
</template>
