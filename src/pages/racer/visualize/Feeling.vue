<script setup lang="ts">
import TopTooltip from 'components/custom/TopTooltip.vue'
import BarChart from 'components/custom/BarChart.vue'
import type { Schema } from 'src/libs/schema'
import type { AnalysisResult } from 'src/libs/evaluate/simulator/analysisResult'
import { formatFloat } from 'libs/utils/format'
import { inject } from 'vue'
import { splice } from 'remeda'

function formatPercentButZero(n: number) {
  return n === 0 ? '0' : formatFloat(n, 2, true)
}

const schema = inject('schema') as Schema
const result = inject('result') as AnalysisResult
</script>

<template>
  <div class="row flex-center">
    <div class="col-4">
      <QMarkupTable separator="horizontal" flat bordered dense>
        <thead class="bg-indigo-5 text-white q-pa-md">
          <tr>
            <th class="text-right">
              测评项目
            </th>
            <th class="text-left">
              {{ schema.cfg?.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-right">
              击键组合数量
            </td>
            <td>
              {{ result.combo }}
            </td>
          </tr>

          <tr>
            <td class="text-right">
              平均当量
            </td>
            <td>
              <TopTooltip>
                总当量：{{ result.Eq }}<br>
                组合数：{{ result.combo }}
              </TopTooltip>
              {{ formatFloat(result.Eq / result.combo, 3) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">
              字均当量
            </td>
            <td>
              <TopTooltip>
                总当量：{{ result.Eq }}<br>
                上屏字数：{{ result.combo }}
              </TopTooltip>
              {{ formatFloat(result.Eq / result.hanzi, 3) }}
            </td>
          </tr>

          <tr>
            <td class="text-right">
              小跨排比例
            </td>
            <td>
              <TopTooltip>
                小跨排次数：{{ result.singleSpan }}<br>
                组合数：{{ result.combo }}
              </TopTooltip>
              {{ formatPercentButZero(result.singleSpan / result.combo) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">
              大跨排比例
            </td>
            <td>
              <TopTooltip>
                大跨排次数：{{ result.multiSpan }}<br>
                组合数：{{ result.combo }}
              </TopTooltip>
              {{ formatPercentButZero(result.multiSpan / result.combo) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">
              错手比例
            </td>
            <td>
              <TopTooltip>
                错手次数：{{ result.longFD }}<br>
                组合数：{{ result.combo }}
              </TopTooltip>
              {{ formatPercentButZero(result.longFD / result.combo) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">
              小指干扰比例
            </td>
            <td>
              <TopTooltip>
                小指干扰次数：{{ result.littleFD }}<br>
                组合数：{{ result.combo }}
              </TopTooltip>
              {{ formatPercentButZero(result.littleFD / result.combo) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">
              二连击比例
            </td>
            <td>
              <TopTooltip>
                二连击次数：{{ result.double }}<br>
                组合数：{{ result.combo }}
              </TopTooltip>
              {{ formatPercentButZero(result.double / result.combo) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">
              三连击比例
            </td>
            <td>
              <TopTooltip>
                三连击次数：{{ result.trible }}<br>
                三键组合数：{{ result.combo - 1 }}
              </TopTooltip>
              {{ formatPercentButZero(result.trible / (result.combo - 1)) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">
              同指组合比例
            </td>
            <td>
              <TopTooltip>
                同指组合次数：{{ result.sameFingers }}<br>
                组合数：{{ result.combo }}
              </TopTooltip>
              {{ formatPercentButZero(result.sameFingers / (result.combo)) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">
              异指组合比例
            </td>
            <td>
              <TopTooltip>
                异指组合次数：{{ result.combo - result.sameFingers }}<br>
                组合数：{{ result.combo }}
              </TopTooltip>
              {{ formatPercentButZero(1 - result.sameFingers / result.combo) }}
            </td>
          </tr>
        </tbody>
      </QMarkupTable>
    </div>

    <div class="col-4">
      <BarChart
        title="各手指击键数"
        :labels="['大拇指', '左手小指', '左手无名指', '左手中指', '左手食指', '右手食指', '右手中指', '右手无名指', '右手小指']"
        :datasets="[{
          label: schema.cfg!.name!,
          data: splice(result.fingersDist, 5, 2, []),
        }]"
      />
    </div>
  </div>
</template>
