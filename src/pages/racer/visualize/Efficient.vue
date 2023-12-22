<script setup lang="ts">
import TopTooltip from 'components/custom/TopTooltip.vue'
import BarChart from 'components/custom/BarChart.vue'
import type { Schema } from 'src/libs/schema'
import type { AnalysisResult } from 'src/libs/evaluate/simulator/analysisResult'
import { formatFloat, formatTimeSpan } from 'libs/utils/format'
import { inject } from 'vue'
import { makeLabelAndDatas } from './utils'

const schema = inject('schema') as Schema
const result = inject('result') as AnalysisResult
const schema2 = inject('schema2') as Schema
const result2 = inject('result2') as AnalysisResult

const wordsDistLabelAndDatas = makeLabelAndDatas([result.wordsDist, result2.wordsDist], '字词', '单字')
const codeLenLabelAndDatas = makeLabelAndDatas([result.codeLengthDist, result2.codeLengthDist], '码')
const collisionLabelAndDatas = makeLabelAndDatas([result.collisionDist, result2.collisionDist], '重', '首选')
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
            {{ schema.cfg?.name }}
          </th>
          <th class="text-left">
            {{ schema2.cfg?.name }}
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
              {{ [...result.lackCounter.keys()].join('') }}
            </TopTooltip>
            {{ result.lack }}
          </td>
          <td>
            <TopTooltip v-if="result2.lackCounter.size">
              {{ [...result2.lackCounter.keys()].join('') }}
            </TopTooltip>
            {{ result2.lack }}
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
            上屏词语次数
          </td>
          <td>
            {{ result.words }}
          </td>
          <td>
            {{ result2.words }}
          </td>
        </tr>

        <tr>
          <td class="text-right">
            上屏词语字数
          </td>
          <td>
            {{ result.wordsChar }}
          </td>
          <td>
            {{ result2.wordsChar }}
          </td>
        </tr>

        <tr>
          <td class="text-right">
            平均码长
          </td>
          <td>
            <TopTooltip>
              总码长：{{ result.codeLength }} <br> 总上屏：{{ result.commit }}
            </TopTooltip>
            {{ formatFloat(result.codeLength / result.commit) }}
          </td>
          <td>
            <TopTooltip>
              总码长：{{ result2.codeLength }} <br> 总上屏：{{ result2.commit }}
            </TopTooltip>
            {{ formatFloat(result2.codeLength / result2.commit) }}
          </td>
        </tr>
        <tr>
          <td class="text-right">
            字均码长
          </td>
          <td>
            <TopTooltip>
              总码长：{{ result.codeLength }} <br> 总字数：{{ result.hanzi }}
            </TopTooltip>
            {{ formatFloat(result.codeLength / result.hanzi) }}
          </td>
          <td>
            <TopTooltip>
              总码长：{{ result2.codeLength }} <br> 总字数：{{ result2.hanzi }}
            </TopTooltip>
            {{ formatFloat(result2.codeLength / result2.hanzi) }}
          </td>
        </tr>
        <tr>
          <td class="text-right">
            跟打用时(击键8)
          </td>
          <td>
            <TopTooltip>
              按键总次数：{{ result.keys }}
            </TopTooltip>
            {{ formatTimeSpan(result.keys / 8) }}
          </td>
          <td>
            <TopTooltip>
              按键总次数：{{ result2.keys }}
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
          label: schema.cfg!.name!,
          data: wordsDistLabelAndDatas.data[0],
        }, {
          label: schema2.cfg!.name!,
          data: wordsDistLabelAndDatas.data[1],
        }]"
      />
    </div>
    <div class="col-12 col-sm-5">
      <BarChart
        title="选重分布"
        :labels="collisionLabelAndDatas.label"
        :datasets="[{
          label: schema.cfg!.name!,
          data: collisionLabelAndDatas.data[0],
        }, {
          label: schema2.cfg!.name!,
          data: collisionLabelAndDatas.data[1],
        }]"
      />
    </div>
    <div class="col-12 col-sm-5">
      <BarChart
        title="码长分布"
        :labels="codeLenLabelAndDatas.label"
        :datasets="[{
          label: schema.cfg!.name!,
          data: codeLenLabelAndDatas.data[0],
        }, {
          label: schema2.cfg!.name!,
          data: codeLenLabelAndDatas.data[1],
        }]"
      />
    </div>
  </div>
</template>
