<script setup lang="ts">
import { type Mabiao, getCodeToWordsDict } from 'src/libs/schema'
import { formatFloat, formatInterger } from 'libs/utils'
import { getCollisionCollection, getSingleHanziSet } from 'libs/evaluate/mabiao'
import MabiaoItem from './MabiaoItem.vue'

/** 测评码表本身 */
const props = defineProps<{
  mabiao: Mabiao
}>()

const singleHanziSet = getSingleHanziSet(props.mabiao)
const collisionCollection = getCollisionCollection(props.mabiao)
</script>

<template>
  <div class="q-py-md">
    <MabiaoItem label="码表行数" :value="formatInterger(mabiao.items.length)" />
  </div>
  <div class="q-py-md">
    <MabiaoItem label="单字数量" :value="formatInterger(singleHanziSet.size)" />
  </div>
  <div class="q-py-md row">
    <div class="col">
      <MabiaoItem label="有重码的编码" :value="formatInterger(collisionCollection.length)" />
    </div>
    <div class="col q-mx-md">
      <MabiaoItem label="占比" :value="formatFloat(collisionCollection.length / getCodeToWordsDict(mabiao).size, 2, true)" />
    </div>
  </div>
</template>
