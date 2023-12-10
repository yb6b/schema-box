<script lang="ts" setup>
import type { Schema, SchemaDict } from 'libs/schema'

import { onMounted, reactive, ref, shallowRef } from 'vue'
import { mdiTextBoxEditOutline } from '@quasar/extras/mdi-v7'
import { countDictItems, createEmptySchema } from 'libs/schema/schemaUtils'
import { loadDuoduoDict } from 'libs/platforms/duoduo/load'

import OnlyTitlebarLayout from 'layouts/OnlyTitlebarLayout.vue'
import LoadFileDialog from 'components/loadFile/LoadFileDialog.vue'
import RawFile from 'src/libs/platforms/rawFile'
import Visualize from './visualize/Visualize.vue'

// import moc_article from 'app/dist/xinqing_jueding.js'
// import moc_qqwb from 'app/dist/qqwb.js'
// import moc_xima from 'app/dist/xima.js'

const openArticle = ref(false)
const articleData = reactive({
  name: '',
  content: '',
})

const openSchema = ref(false)
const schemaData = shallowRef(createEmptySchema())
const openSchema2 = ref(false)
const schemaData2 = shallowRef(createEmptySchema())

const openVisualize = ref(false)

/*
// 开发模式下，直接提供一些方案
if (process.env.DEV) {
  onMounted(async () => {
    articleData.name = '心情决定事情'
    articleData.content = moc_article
    const raw = await loadDuoduoDict(new RawFile(moc_qqwb))
    schemaData.value = raw
    schemaData.value.cfg = { name: 'QQ五笔', cmLen: 4, raw: moc_qqwb, plat: 'duoduo', selectKeys: ' ;3456789' }
    schemaData2.value = await loadDuoduoDict(new RawFile(moc_xima))
    schemaData2.value.cfg = { name: '希码', cmLen: 4, raw: moc_qqwb, plat: 'duoduo', selectKeys: ' ,./56789' }
  })
}
*/

function displayDict(d: SchemaDict): string {
  let r = ''
  let count = 0
  // 最多前10条
  for (const i of d.items) {
    r += `${i[1]} ${i[0]} `
    if (++count >= 10)
      break
  }
  return r
}
</script>

<template>
  <OnlyTitlebarLayout title="测评工具">
    <div class="columns q-pt-xl">
      <QList bordered padding style="width:22rem" class="col bg-white">
        <QItemLabel header>
          赛文
        </QItemLabel>
        <QItem clickable @click="() => openArticle = true">
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

        <QItem clickable @click="_ => openSchema = true">
          <QItemSection v-if="countDictItems(schemaData) === 0">
            <QItemLabel>
              <div class="text-subtitle1 text-primary">
                点击载入码表
              </div>
            </QItemLabel>
          </QItemSection>
          <QItemSection v-else>
            <QItemLabel>
              {{ schemaData?.cfg?.name || "" }}
              <QBadge
                rounded
                color="blue-grey-5"
                :label="`${countDictItems(schemaData)} 行`"
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
        <QItem clickable @click="_ => openSchema2 = true">
          <QItemSection v-if="countDictItems(schemaData2) === 0">
            <QItemLabel>
              <div class="text-subtitle1 text-primary">
                点击载入副码表
              </div>
            </QItemLabel>
          </QItemSection>
          <QItemSection v-else>
            <QItemLabel>
              {{ schemaData2?.cfg?.name || "" }}
              <QBadge
                rounded
                color="blue-grey-5"
                :label="`${countDictItems(schemaData2)} 行`"
              />
            </QItemLabel>
            <QItemLabel caption style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
              {{ displayDict(schemaData2.dicts[0]) }}
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
        v-model:dialog="openSchema2"
        dict-mode
        @value="(v) => {
          schemaData2.cfg = v.options
          loadDuoduoDict(v.content!).then(
            v => schemaData2.dicts[0] = v.dicts[0],
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
      <QDialog v-model="openVisualize" maximized>
        <Visualize
          v-if="openVisualize"
          v-model:dialog="openVisualize"
          :article="articleData"
          :schema="schemaData"
          :schema2="schemaData2"
        />
      </QDialog>

      <div class="col row flex-center">
        <QBtn
          :disable="!articleData.name || !schemaData?.cfg?.name"
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
  </OnlyTitlebarLayout>
</template>
