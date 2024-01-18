<script setup lang="ts">
import TopTooltip from 'components/custom/TopTooltip.vue'
import BarChart from 'components/custom/BarChart.vue'
import { formatFloat, formatTimeSpan } from 'libs/utils/format'
import { computed } from 'vue'
import { makeLabelAndDatas } from './utils'
import type { AllSimulatorInfo } from './inject'

const props = defineProps<{
  allInfo: AllSimulatorInfo
}>()

const result = computed(() => props.allInfo.mb.analysis)
const result2 = computed(() => props.allInfo.mb2.analysis)
const mabiao = computed(() => props.allInfo.mb.mb)
const mabiao2 = computed(() => props.allInfo.mb2.mb)

const wordsDistLabelAndDatas = makeLabelAndDatas([result.value.wordsDist, result2.value.wordsDist], '字词', '单字')
const codeLenLabelAndDatas = makeLabelAndDatas([result.value.codeLenDist, result2.value.codeLenDist], '码')
const collisionLabelAndDatas = makeLabelAndDatas([result.value.collisionDist, result2.value.collisionDist], '重', '首选')
</script>

<template>
  <div class="row justify-center">
    <!-- 表格展示 -->
    <QMarkupTable separator="horizontal" flat bordered dense>
      <thead class="bg-indigo-5 text-white q-pa-md">
        <tr>
          <th class="text-right">
            测试项目
          </th>
          <th class="text-left">
            {{ mabiao?.name }}
          </th>
          <th class="text-left">
            {{ mabiao2?.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-right">
            缺字数量
          </td>
          <td>
            <TopTooltip v-if="result.lackCounter.size">
              {{ result.lackString }}
            </TopTooltip>
            {{ result.lacks }}
          </td>
          <td>
            <TopTooltip v-if="result2.lackCounter.size">
              {{ result2.lackString }}
            </TopTooltip>
            {{ result2.lacks }}
          </td>
        </tr>

        <tr>
          <td class="text-right">
            上屏总次数
          </td>
          <td>
            {{ result.commit }}
          </td>
          <td>
            {{ result2.commit }}
          </td>
        </tr>

        <tr>
          <td class="text-right">
            上屏单字次数
          </td>
          <td>
            {{ result.singleCount }}
          </td>
          <td>
            {{ result2.singleCount }}
          </td>
        </tr>

        <tr>
          <td class="text-right">
            平均码长
          </td>
          <td>
            <TopTooltip>
              总码长：{{ result.codeLen }} <br> 总上屏：{{ result.commit }}
            </TopTooltip>
            {{ formatFloat(result.codeLen / result.commit) }}
          </td>
          <td>
            <TopTooltip>
              总码长：{{ result2.codeLen }} <br> 总上屏：{{ result2.commit }}
            </TopTooltip>
            {{ formatFloat(result2.codeLen / result2.commit) }}
          </td>
        </tr>
        <tr>
          <td class="text-right">
            字均码长
          </td>
          <td>
            <TopTooltip>
              总码长：{{ result.codeLen }} <br> 总字符数：{{ result.char }}
            </TopTooltip>
            {{ formatFloat(result.codeLen / result.char) }}
          </td>
          <td>
            <TopTooltip>
              总码长：{{ result2.codeLen }} <br> 总字符数：{{ result2.char }}
            </TopTooltip>
            {{ formatFloat(result2.codeLen / result2.char) }}
          </td>
        </tr>
        <tr>
          <td class="text-right">
            跟打用时(击键8)
          </td>
          <td>
            <TopTooltip>
              击键次数：{{ result.keys }}
            </TopTooltip>
            {{ formatTimeSpan(result.keys / 8) }}
          </td>
          <td>
            <TopTooltip>
              击键次数：{{ result2.keys }}
            </TopTooltip>
            {{ formatTimeSpan(result2.keys / 8) }}
          </td>
        </tr>
      </tbody>
    </QMarkupTable>
  </div>
  <!-- 条形图 -->
  <div class="row q-gutter-lg justify-center">
    <div class="col-12 col-sm-5">
      <BarChart
        title="上屏词语长度分布"
        :labels="wordsDistLabelAndDatas.label"
        :datasets="[{
          label: mabiao.name!,
          data: wordsDistLabelAndDatas.data[0],
        }, {
          label: mabiao2.name!,
          data: wordsDistLabelAndDatas.data[1],
        }]"
      />
    </div>
    <div class="col-12 col-sm-5">
      <BarChart
        title="选重分布"
        :labels="collisionLabelAndDatas.label"
        :datasets="[{
          label: mabiao.name!,
          data: collisionLabelAndDatas.data[0],
        }, {
          label: mabiao2.name!,
          data: collisionLabelAndDatas.data[1],
        }]"
      />
    </div>
    <div class="col-12 col-sm-5">
      <BarChart
        title="码长分布"
        :labels="codeLenLabelAndDatas.label"
        :datasets="[{
          label: mabiao.name!,
          data: codeLenLabelAndDatas.data[0],
        }, {
          label: mabiao2.name!,
          data: codeLenLabelAndDatas.data[1],
        }]"
      />
    </div>
  </div>
</template>
