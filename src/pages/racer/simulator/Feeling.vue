<script setup lang="ts">
import TopTooltip from 'components/custom/TopTooltip.vue'
import BarChart from 'components/custom/BarChart.vue'

import { formatFloat } from 'libs/utils/format'
import { inject } from 'vue'
import { splice } from 'remeda'
import { jMabiao, jMabiao2, jResult, jResult2 } from './inject'

const mabiao = inject(jMabiao)!
const result = inject(jResult)!
const mabiao2 = inject(jMabiao2)!
const result2 = inject(jResult2)!

function formatPercentButZero(n: number) {
  return n === 0 ? '0' : formatFloat(n, 2, true)
}

const keyboard = ['1234567890', 'qwertyuiop', 'asdfghjkl;', 'zxcvbnm,./']
</script>

<template>
  <div class=" flex-center q-col-gutter-md">
    <div class="row justify-center">
      <QMarkupTable separator="horizontal" flat bordered dense>
        <thead class="bg-indigo-5 text-white q-pa-md">
          <tr>
            <th class="text-right">
              测评项目
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
              击键组合数量
            </td>
            <td>
              {{ result.combo }}
            </td>
            <td>
              {{ result2.combo }}
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
            <td>
              <TopTooltip>
                总当量：{{ result2.Eq }}<br>
                组合数：{{ result2.combo }}
              </TopTooltip>
              {{ formatFloat(result2.Eq / result2.combo, 3) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">
              字均当量
            </td>
            <td>
              <TopTooltip>
                总当量：{{ result.Eq }}<br>
                上屏字符总数：{{ result.char }}
              </TopTooltip>
              {{ formatFloat(result.Eq / result.char, 3) }}
            </td>
            <td>
              <TopTooltip>
                总当量：{{ result2.Eq }}<br>
                上屏字符总数：{{ result2.char }}
              </TopTooltip>
              {{ formatFloat(result2.Eq / result2.char, 3) }}
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
            <td>
              <TopTooltip>
                小跨排次数：{{ result2.singleSpan }}<br>
                组合数：{{ result2.combo }}
              </TopTooltip>
              {{ formatPercentButZero(result2.singleSpan / result2.combo) }}
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
            <td>
              <TopTooltip>
                大跨排次数：{{ result2.multiSpan }}<br>
                组合数：{{ result2.combo }}
              </TopTooltip>
              {{ formatPercentButZero(result2.multiSpan / result2.combo) }}
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
            <td>
              <TopTooltip>
                错手次数：{{ result2.longFD }}<br>
                组合数：{{ result2.combo }}
              </TopTooltip>
              {{ formatPercentButZero(result2.longFD / result2.combo) }}
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
            <td>
              <TopTooltip>
                小指干扰次数：{{ result2.littleFD }}<br>
                组合数：{{ result2.combo }}
              </TopTooltip>
              {{ formatPercentButZero(result2.littleFD / result2.combo) }}
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
            <td>
              <TopTooltip>
                二连击次数：{{ result2.double }}<br>
                组合数：{{ result2.combo }}
              </TopTooltip>
              {{ formatPercentButZero(result2.double / result2.combo) }}
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
            <td>
              <TopTooltip>
                同指组合次数：{{ result2.sameFingers }}<br>
                组合数：{{ result2.combo }}
              </TopTooltip>
              {{ formatPercentButZero(result2.sameFingers / (result2.combo)) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">
              异手互击比例
            </td>
            <td>
              <TopTooltip>
                先左手再右手的组合次数：{{ result.leftRight }}<br>
                先右手再左手的组合次数：{{ result.rightLeft }}<br>
                组合数：{{ result.combo }}
              </TopTooltip>
              {{ formatPercentButZero(result.diffHand / result.combo) }}
            </td>
            <td>
              <TopTooltip>
                先左手再右手的组合次数：{{ result2.leftRight }}<br>
                先右手再左手的组合次数：{{ result2.rightLeft }}<br>
                组合数：{{ result2.combo }}
              </TopTooltip>
              {{ formatPercentButZero(result2.diffHand / result2.combo) }}
            </td>
          </tr>
        </tbody>
      </QMarkupTable>
    </div>

    <div class="row justify-center q-mx-lg">
      <div class="col-full col-md-6">
        <BarChart
          title="各手指击键数"
          :labels="['大拇指', '左手小指', '左手无名指', '左手中指', '左手食指', '右手食指', '右手中指', '右手无名指', '右手小指']"
          :datasets="[{
                        label: mabiao!.name!,
                        data: splice(result.finDist, 5, 2, []),
                      },
                      {
                        label: mabiao2!.name!,
                        data: splice(result2.finDist, 5, 2, []),
                      }]"
        />
      </div>
    </div>
  </div>
  <h3 class="text-subtitle2 text-center text-grey-8">
    按键使用率
  </h3>
  <div class="row q-gutter-lg justify-center">
    <div class="col-12 col-sm-5">
      <div class="text-center">
        {{ mabiao?.name }}
      </div>
      <div class="column no-wrap content-center">
        <div v-for="line of keyboard" :key="line" class="col row">
          <template v-for="k in line" :key="k">
            <div class="col text-center non-selectable" :style="{ backgroundColor: `rgba(239,68,68,${result.keysDist[k] * 20 / result.keys})` }">
              <TopTooltip>
                按键 <kbd v-text="k" /> 按下 {{ result.keysDist[k] }} 次<br>
                占比 {{ formatPercentButZero(result.keysDist[k] / result.keys) }}
              </TopTooltip>
              <kbd>{{ k }}</kbd>
            </div>
          </template>
        </div>
        <div
          class="col row"
        >
          <div class="col-3" />
          <div
            class="col text-center"
            :style="{ backgroundColor: `rgba(239,68,68,${result.keysDist[' '] * 10 / result.keys})` }"
          >
            <TopTooltip>
              空格键按下 {{ result.keysDist[' '] }} 次<br>
              占比 {{ formatPercentButZero(result.keysDist[' '] / result.keys) }}
            </TopTooltip>
            空格
          </div>
          <div class="col-3" />
        </div>
      </div>
    </div>
    <div class="col-12 col-sm-5">
      <div class="text-center">
        {{ mabiao2?.name }}
      </div>
      <div class="column no-wrap content-center">
        <div v-for="line of keyboard" :key="line" class="col row">
          <template v-for="k in line" :key="k">
            <div class="col text-center non-selectable" :style="{ backgroundColor: `rgba(239,68,68,${result2.keysDist[k] * 20 / result2.keys})` }">
              <TopTooltip>
                按键 <kbd v-text="k" /> 按下 {{ result2.keysDist[k] }} 次<br>
                占比 {{ formatPercentButZero(result2.keysDist[k] / result2.keys) }}
              </TopTooltip>
              <kbd>{{ k }}</kbd>
            </div>
          </template>
        </div>
        <div
          class="col row"
        >
          <div class="col-3" />
          <div
            class="col text-center"
            :style="{ backgroundColor: `rgba(239,68,68,${result2.keysDist[' '] * 10 / result2.keys})` }"
          >
            <TopTooltip>
              空格键按下 {{ result2.keysDist[' '] }} 次<br>
              占比 {{ formatPercentButZero(result2.keysDist[' '] / result2.keys) }}
            </TopTooltip>
            空格
          </div>
          <div class="col-3" />
        </div>
      </div>
    </div>
  </div>
</template>
