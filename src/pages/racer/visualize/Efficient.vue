<script setup lang="ts">
import TopTooltip from 'components/custom/TopTooltip.vue'
import BarChart from 'components/custom/BarChart.vue'
import type { Schema } from 'src/libs/schema'
import type { AnalysisResult } from 'src/libs/evaluate/simulator/analysisResult'
import { formatFloat } from 'libs/utils/format'
import { dropLastFalsyItems } from 'libs/utils/array'
import { inject } from 'vue'

const schema = inject('schema') as Schema
const result = inject('result') as AnalysisResult
const schema2 = inject('schema2') as Schema
const result2 = inject('result2') as AnalysisResult

function makeLabel(dist: number[], suffix: string, firstItemName: string) {
  const shrinkedDist = dropLastFalsyItems(dist)
  const distLabels = Object.keys(shrinkedDist).map((_, i) => `${i + 1} ${suffix}`)
  distLabels[0] = firstItemName
  return distLabels
}
</script>

<template>
  <div class="row justify-center">
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
      </tbody>
    </QMarkupTable>
  </div>
  <div class="row q-gutter-lg justify-center">
    <div class="col-12 col-sm-5">
      <BarChart
        title="上屏词语长度分布"
        :labels="makeLabel(result.wordsDist, '字词', '打单')"
        :datasets="[{
          label: schema.cfg!.name!,
          data: dropLastFalsyItems(result.wordsDist),
        }, {
          label: schema2.cfg!.name!,
          data: dropLastFalsyItems(result2.wordsDist),
        }]"
      />
    </div>
    <div class="col-12 col-sm-5">
      <BarChart
        title="选重分布"
        :labels="makeLabel(result.codeLengthDist, '重', '首选')"
        :datasets="[{
          label: schema.cfg!.name!,
          data: dropLastFalsyItems(result.wordsDist),
        }, {
          label: schema2.cfg!.name!,
          data: dropLastFalsyItems(result2.wordsDist),
        }]"
      />
    </div>
  </div>
</template>
