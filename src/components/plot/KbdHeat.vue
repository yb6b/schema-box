<script setup lang="ts">
import { formatFloat } from '../../libs/utils'

const p = defineProps<{
  keyMap: Map<string, number>
}>()

const kbd = [
  '1234567890-=',
  'qwertyuiop[]',
  'asdfghjkl;\' ',
  'zxcvbnm,./  ',
]

function fmtUsageFreq(key: string) {
  const usage = p.keyMap
  const freq = usage.get(key)
  if (!freq || freq <= 0)
    return ''
  return formatFloat(freq * 100, 2)
}

function bgColor(freq?: number) {
  return `rgba(239,68,68,${(freq ?? 0) * 20})`
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
      style="width: 50rem;"
    >
      <div
        v-for="k in keyRow" :key="k"
        class="col q-ma-xs text-left"
        style="height: 3.7rem; width: 4rem"
      >
        <template v-if="k === ' '">
          <div />
        </template>
        <div
          v-else
          class="q-pa-sm fit key"
          :style="{ backgroundColor: bgColor(keyMap.get(k)) }"
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
    <div class="col q-py-sm">
      <div
        class="text-center key"
        style="width: 18rem"
        :style="{ backgroundColor: bgColor(keyMap.get(' ')) }"
      >
        空格
        <div class="text-weight-thin">
          {{ fmtUsageFreq(' ') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.key{
    width: 3rem;
    height: 3rem;
    border: 1px solid #494a4e6d;
    border-radius: 6px;
    box-shadow: 0 3px 6px #32333868;
}
</style>
