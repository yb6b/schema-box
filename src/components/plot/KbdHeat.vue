<script setup lang="ts">
import { formatFloat } from '../../libs/utils'

const p = defineProps<{
  keyMap: Record<string, number>
}>()

const kbd = [
  '1234567890-=',
  'qwertyuiop[]',
  'asdfghjkl;\' ',
  'zxcvbnm,./  ',
]

function fmtUsageFreq(key: string) {
  const usage = p.keyMap
  const freq = usage[key]
  if (!freq || freq <= 0)
    return ''
  return formatFloat(freq * 100, 2)
}

function bgColor(freq?: number) {
  return `rgba(255,140,49,${(freq ?? 0) * 20})`
}
</script>

<template>
  <div
    class="column items-center "
  >
    <div
      v-for="keyRow in kbd"
      :key="keyRow"
      class="col row"
      style="width: 45rem;"
    >
      <div
        v-for="k in keyRow" :key="k"
        class="col q-ma-xs text-left"
      >
        <template v-if="k === ' '">
          <div />
        </template>
        <div
          v-else
          class="q-pa-sm fit key"
          :style="{ backgroundColor: bgColor(keyMap[k] ?? 0) }"
        >
          <div class="text-uppercase text-bold text-grey-9">
            <kbd>{{ k }}</kbd>
          </div>
          <div class="text-weight-thin text-right text-small">
            {{ fmtUsageFreq(k) }}
          </div>
        </div>
      </div>
    </div>
    <div class="col q-py-sm">
      <div
        class="text-center key q-pa-xs"
        style="width: 18rem"
        :style="{ backgroundColor: bgColor(keyMap[' '] ?? 0) }"
      >
        <div class="text-grey-9">
          空格
        </div>
        <div class="text-weight-thin text-small">
          {{ fmtUsageFreq(' ') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.key{
    width: 3.6rem;
    height: 3rem;
    overflow-y: hidden;
    border: 1px solid #494a4e6d;
    border-radius: 6px;
    box-shadow: 0 3px 6px #32333868;
}
</style>
