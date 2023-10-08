<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { mdiTextBoxEditOutline } from '@quasar/extras/mdi-v7'
import LoadFile from './GetUserContent.vue'
import DictOpt from './DictOptions.vue'

const b = ref('')
const openArticle = ref(false)
const articleData = reactive({
  name: '新的出口',
  content: '把龙单s💝\n💝\n💝 💝\t💝💝💝💝💝💝💝💝💝💝💝💝💝💝💝💝💝方a;lkj;lhd;kgjhsd;fh;sdfhjkh slkjdfhlksdgflsgdfluiglsjkdfhlkasjdhflklsdfh',
  length: 2,
})

const openSchema = ref(false)
const schemaData = reactive({
  name: 'wubi',
  content: 'aa 的\nbb 一',
  length: 2,
})

function briefContent(content: string, CharLengthBoundary = 40): string {
  const result = new Array(CharLengthBoundary)
  let count = 0
  for (const w of content) {
    if (++count > CharLengthBoundary)
      break
    result[count] = w
  }
  if (count < CharLengthBoundary)
    return result.join('')
  else
    return `${result.join('')} ……`
}
</script>

<template>
  <q-list bordered padding>
    <q-item-label header>
      赛文
    </q-item-label>
    <q-item clickable @click="openArticle = true">
      <q-item-section>
        <q-item-label>
          {{ articleData.name }}
          <q-badge
            rounded
            color="blue-grey-5"
            :label="`${articleData.length} 字`"
          />
        </q-item-label>
        <q-item-label caption>
          {{ briefContent(articleData.content) }}
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon :name="mdiTextBoxEditOutline" />
      </q-item-section>
    </q-item>
    <q-separator spaced />
    <q-item-label header>
      码表
    </q-item-label>
    <q-item clickable @click="openSchema = true">
      <q-item-section>
        <q-item-label>
          {{ schemaData.name }}
          <q-badge
            rounded
            color="blue-grey-5"
            :label="`${schemaData.length} 行`"
          />
        </q-item-label>
        <q-item-label caption>
          {{ briefContent(schemaData.content) }}
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon :name="mdiTextBoxEditOutline" />
      </q-item-section>
    </q-item>
  </q-list>
  <q-dialog v-model="openArticle">
    <q-card class="q-pa-md m">
      <LoadFile @load="v => b = v" />
    </q-card>
  </q-dialog>
  <q-dialog v-model="openSchema">
    <q-card class="m">
      <q-card-section class="row  q-pa-md">
        <LoadFile dict-mode class="col-xs-12 col-sm-6 q-pa-sm" @load="v => b = v" />
        <DictOpt class="col-xs-12 col-sm-6 q-pa-sm" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat @click="openSchema = false">
          确定
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.m{
  min-width: min(90vw,32rem);
}
</style>
