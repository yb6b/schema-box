<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { mdiTextBoxEditOutline } from '@quasar/extras/mdi-v7'
import type { SchemaDict } from 'libs/schema'
import { Schema } from 'libs/schema'
import { loadDuoduoDict } from 'libs/platforms/duoduo/load'
import LoadFileDialog from './loadFile/LoadFileDialog.vue'
import VisualizeDialog from './visualize/VisualizeDialog.vue'

const openArticle = ref(false)
const articleData = reactive({
  name: '',
  content: '',
})

const openSchema = ref(false)
const schemaData = ref(new Schema())

const openVisualize = ref(false)

function displayDict(d: SchemaDict): string {
  let r = ''
  let count = 0
  // 最多前10条
  for (const i of d.items) {
    r += `${i.code} ${i.words} `
    if (++count >= 10)
      break
  }
  return r
}
</script>

<template>
  <div class="columns q-pt-xl">
    <QList bordered padding style="width:22rem" class="col bg-white">
      <QItemLabel header>
        赛文
      </QItemLabel>
      <QItem clickable @click="openArticle = true">
        <QItemSection v-if="articleData.content === ''">
          <QItemLabel>
            <div class="text-subtitle1 text-primary">
              点击加载赛文
            </div>
          </QItemLabel>
        </QItemSection>
        <QItemSection v-else>
          <QItemLabel>
            {{ articleData.name }}
            <QBadge
              rounded
              color="blue-grey-5"
              :label="`${articleData.content.length} 字`"
            />
          </QItemLabel>
          <QItemLabel caption style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
            {{ articleData.content.slice(0, 50) }}
          </QItemLabel>
        </QItemSection>

        <QItemSection side>
          <QIcon :name="mdiTextBoxEditOutline" />
        </QItemSection>
      </QItem>
      <QSeparator spaced />
      <QItemLabel header>
        码表
      </QItemLabel>
      <QItem clickable @click="openSchema = true">
        <QItemSection v-if="schemaData.dictsItemsCount() === 0">
          <QItemLabel>
            <div class="text-subtitle1 text-primary">
              点击载入码表
            </div>
          </QItemLabel>
        </QItemSection>
        <QItemSection v-else>
          <QItemLabel>
            {{ schemaData.cfg.name || "" }}
            <QBadge
              rounded
              color="blue-grey-5"
              :label="`${schemaData.dictsItemsCount()} 行`"
            />
          </QItemLabel>
          <QItemLabel caption style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
            {{ displayDict(schemaData.dicts[0]) }}
          </QItemLabel>
        </QItemSection>

        <QItemSection side>
          <QIcon :name="mdiTextBoxEditOutline" />
        </QItemSection>
      </QItem>
    </QList>

    <LoadFileDialog
      v-model:dialog="openSchema"
      dict-mode
      @value="(v) => {
        schemaData.cfg = v.options
        loadDuoduoDict(v.content!).then(
          v => schemaData.dicts[0] = v.dicts[0],
        )
      }"
    />
    <LoadFileDialog
      v-model:dialog="openArticle"
      @value="v => {
        v.content?.getText().then(t => articleData.content = t)
        articleData.name = v.options.name!
      }"
    />

    <VisualizeDialog
      v-if="openVisualize"
      v-model:dialog="openVisualize"
      :article="articleData"
      :dict="schemaData"
    />

    <div class="col row flex-center">
      <QBtn
        :disable="!articleData.name || !schemaData.cfg.name"
        label="计 算"
        color="primary"
        rounded
        glossy
        class="col-6 q-mt-lg"
        @click="
          () => {
            openVisualize = true
          }"
      />
    </div>
  </div>
</template>
