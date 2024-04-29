<script setup lang="ts">
import { computed } from 'vue'
import { splice } from 'remeda'
import type { AllSimulatorInfo } from './inject'
import TopTooltip from '@/components/custom/tooltip-on-top.vue'
import BarChart from '@/components/custom/bar-chart.vue'
import { formatFloat } from '@/libs/utils/format'

const props = defineProps<{
  allInfo: AllSimulatorInfo
}>()

const analysis1 = computed(() => props.allInfo.mb.analysis)
const analysis2 = computed(() => props.allInfo.mb2.analysis)

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
              {{ allInfo.mb.mb.name }}
            </th>
            <th class="text-left">
              {{ allInfo.mb2.mb.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-right">
              击键组合数量
            </td>
            <td>
              {{ analysis1.combo }}
            </td>
            <td>
              {{ analysis2.combo }}
            </td>
          </tr>

          <tr>
            <td class="text-right">
              平均当量
            </td>
            <td>
              <TopTooltip>
                总当量：{{ analysis1.Eq }}<br>
                组合数：{{ analysis1.combo }}
              </TopTooltip>
              {{ formatFloat(analysis1.Eq / analysis1.combo, 3) }}
            </td>
            <td>
              <TopTooltip>
                总当量：{{ analysis2.Eq }}<br>
                组合数：{{ analysis2.combo }}
              </TopTooltip>
              {{ formatFloat(analysis2.Eq / analysis2.combo, 3) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">
              字均当量
            </td>
            <td>
              <TopTooltip>
                总当量：{{ analysis1.Eq }}<br>
                上屏字符总数：{{ analysis1.char }}
              </TopTooltip>
              {{ formatFloat(analysis1.Eq / analysis1.char, 3) }}
            </td>
            <td>
              <TopTooltip>
                总当量：{{ analysis2.Eq }}<br>
                上屏字符总数：{{ analysis2.char }}
              </TopTooltip>
              {{ formatFloat(analysis2.Eq / analysis2.char, 3) }}
            </td>
          </tr>

          <tr>
            <td class="text-right">
              小跨排比例
            </td>
            <td>
              <TopTooltip>
                小跨排次数：{{ analysis1.singleSpan }}<br>
                组合数：{{ analysis1.combo }}
              </TopTooltip>
              {{ formatPercentButZero(analysis1.singleSpan / analysis1.combo) }}
            </td>
            <td>
              <TopTooltip>
                小跨排次数：{{ analysis2.singleSpan }}<br>
                组合数：{{ analysis2.combo }}
              </TopTooltip>
              {{ formatPercentButZero(analysis2.singleSpan / analysis2.combo) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">
              大跨排比例
            </td>
            <td>
              <TopTooltip>
                大跨排次数：{{ analysis1.multiSpan }}<br>
                组合数：{{ analysis1.combo }}
              </TopTooltip>
              {{ formatPercentButZero(analysis1.multiSpan / analysis1.combo) }}
            </td>
            <td>
              <TopTooltip>
                大跨排次数：{{ analysis2.multiSpan }}<br>
                组合数：{{ analysis2.combo }}
              </TopTooltip>
              {{ formatPercentButZero(analysis2.multiSpan / analysis2.combo) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">
              错手比例
            </td>
            <td>
              <TopTooltip>
                错手次数：{{ analysis1.longFD }}<br>
                组合数：{{ analysis1.combo }}
              </TopTooltip>
              {{ formatPercentButZero(analysis1.longFD / analysis1.combo) }}
            </td>
            <td>
              <TopTooltip>
                错手次数：{{ analysis2.longFD }}<br>
                组合数：{{ analysis2.combo }}
              </TopTooltip>
              {{ formatPercentButZero(analysis2.longFD / analysis2.combo) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">
              小指干扰比例
            </td>
            <td>
              <TopTooltip>
                小指干扰次数：{{ analysis1.littleFD }}<br>
                组合数：{{ analysis1.combo }}
              </TopTooltip>
              {{ formatPercentButZero(analysis1.littleFD / analysis1.combo) }}
            </td>
            <td>
              <TopTooltip>
                小指干扰次数：{{ analysis2.littleFD }}<br>
                组合数：{{ analysis2.combo }}
              </TopTooltip>
              {{ formatPercentButZero(analysis2.littleFD / analysis2.combo) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">
              二连击比例
            </td>
            <td>
              <TopTooltip>
                二连击次数：{{ analysis1.double }}<br>
                组合数：{{ analysis1.combo }}
              </TopTooltip>
              {{ formatPercentButZero(analysis1.double / analysis1.combo) }}
            </td>
            <td>
              <TopTooltip>
                二连击次数：{{ analysis2.double }}<br>
                组合数：{{ analysis2.combo }}
              </TopTooltip>
              {{ formatPercentButZero(analysis2.double / analysis2.combo) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">
              同指组合比例
            </td>
            <td>
              <TopTooltip>
                同指组合次数：{{ analysis1.sameFingers }}<br>
                组合数：{{ analysis1.combo }}
              </TopTooltip>
              {{ formatPercentButZero(analysis1.sameFingers / (analysis1.combo)) }}
            </td>
            <td>
              <TopTooltip>
                同指组合次数：{{ analysis2.sameFingers }}<br>
                组合数：{{ analysis2.combo }}
              </TopTooltip>
              {{ formatPercentButZero(analysis2.sameFingers / (analysis2.combo)) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">
              异手互击比例
            </td>
            <td>
              <TopTooltip>
                先左手再右手的组合次数：{{ analysis1.leftRight }}<br>
                先右手再左手的组合次数：{{ analysis1.rightLeft }}<br>
                组合数：{{ analysis1.combo }}
              </TopTooltip>
              {{ formatPercentButZero(analysis1.diffHand / analysis1.combo) }}
            </td>
            <td>
              <TopTooltip>
                先左手再右手的组合次数：{{ analysis2.leftRight }}<br>
                先右手再左手的组合次数：{{ analysis2.rightLeft }}<br>
                组合数：{{ analysis2.combo }}
              </TopTooltip>
              {{ formatPercentButZero(analysis2.diffHand / analysis2.combo) }}
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
                        label: allInfo.mb.mb.name!,
                        data: splice(analysis1.finDist, 5, 2, []),
                      },
                      {
                        label: allInfo.mb2.mb.name!,
                        data: splice(analysis2.finDist, 5, 2, []),
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
        {{ allInfo.mb.mb.name }}
      </div>
      <div class="column no-wrap content-center">
        <div v-for="line of keyboard" :key="line" class="col row">
          <template v-for="k in line" :key="k">
            <div class="col text-center non-selectable" :style="{ backgroundColor: `rgba(239,68,68,${analysis1.keysDist[k] * 20 / analysis1.keys})` }">
              <TopTooltip>
                按键 <kbd v-text="k" /> 按下 {{ analysis1.keysDist[k] }} 次<br>
                占比 {{ formatPercentButZero(analysis1.keysDist[k] / analysis1.keys) }}
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
            :style="{ backgroundColor: `rgba(239,68,68,${analysis1.keysDist[' '] * 10 / analysis1.keys})` }"
          >
            <TopTooltip>
              空格键按下 {{ analysis1.keysDist[' '] }} 次<br>
              占比 {{ formatPercentButZero(analysis1.keysDist[' '] / analysis1.keys) }}
            </TopTooltip>
            空格
          </div>
          <div class="col-3" />
        </div>
      </div>
    </div>
    <div class="col-12 col-sm-5">
      <div class="text-center">
        {{ allInfo.mb2.mb.name }}
      </div>
      <div class="column no-wrap content-center">
        <div v-for="line of keyboard" :key="line" class="col row">
          <template v-for="k in line" :key="k">
            <div class="col text-center non-selectable" :style="{ backgroundColor: `rgba(239,68,68,${analysis2.keysDist[k] * 20 / analysis2.keys})` }">
              <TopTooltip>
                按键 <kbd v-text="k" /> 按下 {{ analysis2.keysDist[k] }} 次<br>
                占比 {{ formatPercentButZero(analysis2.keysDist[k] / analysis2.keys) }}
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
            :style="{ backgroundColor: `rgba(239,68,68,${analysis2.keysDist[' '] * 10 / analysis2.keys})` }"
          >
            <TopTooltip>
              空格键按下 {{ analysis2.keysDist[' '] }} 次<br>
              占比 {{ formatPercentButZero(analysis2.keysDist[' '] / analysis2.keys) }}
            </TopTooltip>
            空格
          </div>
          <div class="col-3" />
        </div>
      </div>
    </div>
  </div>
</template>
