<script setup lang="ts">
import type { Mabiao } from 'libs/schema'
import { calcWeightedEvalItems, keysUsage, quickEvaluate, totalFreqFromKeysUsages, zipEvaluationItems } from 'libs/evaluate/hanzi'
import type { QTableProps } from 'quasar'
import InfoTooltip from 'components/custom/InfoTooltip.vue'
import { formatFloat } from 'src/libs/utils'
import SingleNormalRow from './SingleNormalRow.vue'
import SingleSumRow from './SingleSumRow.vue'

/** 测评单字性能，即科学形码测评系统 */
const props = defineProps<{
  mabiao: Mabiao
}>()

defineEmits<{
  table: [data:{
    title: QTableProps['title']
    columns: QTableProps['columns']
    rows: QTableProps['rows']
  }]
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
        <tr>
          <td class="text-right bg-teal-2">
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
            理论<br>二简
            <InfoTooltip>
              统计已取出编码中最大、无重的二简的数量，并计算其加权比重。
            </InfoTooltip>
          </td>
          <td>
            加权<br>键长
            <InfoTooltip>
              键长 = 编码 + 选重键
            </InfoTooltip>
          </td>
          <td>
            加权<br>字均当量
            <InfoTooltip no-container>
              加权字均当量 = （每字当量 × 字频值）之和 ÷ （字频值之和）<br>
              单字当量 = 各按键组合的陈一凡当量之和
            </InfoTooltip>
          </td>
          <td>
            加权<br>键均当量
            <InfoTooltip no-container>
              加权键均当量 = （键均当量 × 字频值）之和 ÷ 字频值之和<br>
              键均当量 = 单字当量 ÷ (键长 - 1)<br>
              键长 = 编码 + 选重键<br>
            </InfoTooltip>
          </td>
          <td>
            左右<br>互击
            <InfoTooltip>
              两个按键不在同一个手区域。
            </InfoTooltip>
          </td>
          <td>
            同指<br>大跨排
            <InfoTooltip><p>两个按键需要用相同手指，但不是同一键。<br>两键相距 <b>两排或多排</b>。</p>例如：<kbd>ce</kbd></InfoTooltip>
          </td>
          <td>
            同指<br>小跨排
            <InfoTooltip><p>两个按键需要用相同手指，但不是同一键。<br>两键相距 <b>一排或一列</b>。</p>例如：<kbd>de</kbd></InfoTooltip>
          </td>
          <td>
            小指<br>干扰
            <InfoTooltip><p>在两个按键中，小指的使用对其它手指产生神经干扰。</p>例如: <kbd>aw pk</kbd></InfoTooltip>
          </td>
          <td>
            错手
            <InfoTooltip>
              <p>因为中指、无名指下沉带动手掌下沉，导致高位按键难以按下的情况。</p>例如: <kbd>xe cr</kbd>
            </InfoTooltip>
          </td>
          <td>
            三连击
            <InfoTooltip>连续三个键相同</InfoTooltip>
          </td>
          <td>
            超标<br>键位
            <InfoTooltip>
              <p>该字的编码使用到了46个按键以外的按键。</p>46个按键指主键盘区所有能打出字符的按键（包括空格），再排除<kbd>`\</kbd>两键。
            </InfoTooltip>
          </td>
          <td>
            缺字<br>标记
            <InfoTooltip>码表中缺少某字</InfoTooltip>
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
