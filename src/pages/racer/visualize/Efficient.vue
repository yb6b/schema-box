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
const shrinpWordsDist = dropLastFalsyItems(result.wordsDist)
const wordsDistLabels = Object.keys(shrinpWordsDist).map((_, i) => `${i + 1} 字词`)
wordsDistLabels[0] = '打单'
</script>

<template>
  <div class="row flex-center">
    <div class="col-4">
      <QMarkupTable separator="horizontal" flat bordered dense>
        <thead class="bg-indigo-5 text-white q-pa-md">
          <tr>
            <th class="text-right">
              测试项目
            </th>
            <th>
              {{ schema.cfg?.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-right">
              缺字数量
            </td>
            <td>
              <TopTooltip>
                {{ [...result.lackCounter.keys()].join('') }}
              </TopTooltip>
              {{ result.lack }}
            </td>
          </tr>

          <tr>
            <td class="text-right">
              上屏总次数
            </td>
            <td>
              {{ result.commit }}
            </td>
          </tr>

          <tr>
            <td class="text-right">
              上屏词语次数
            </td>
            <td>
              {{ result.words }}
            </td>
          </tr>

          <tr>
            <td class="text-right">
              上屏词语字数
            </td>
            <td>
              {{ result.wordsChar }}
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
          </tr>
        </tbody>
      </QMarkupTable>
    </div>
    <div class="col-4">
      <BarChart
        title="上屏词语长度分布"
        :labels="wordsDistLabels"
        :datasets="[{
          label: schema.cfg!.name!,
          data: shrinpWordsDist,
        }]"
      />
    </div>
  </div>
</template>
