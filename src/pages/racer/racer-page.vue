<script lang="ts" setup>
import { computed, defineAsyncComponent, onErrorCaptured, shallowRef } from 'vue'
import { mdiCog, mdiHelpCircle } from '@quasar/extras/mdi-v7'

import { useQuasar } from 'quasar'
import SchemaCard from './schema-card.vue'
import ArticleCard from './article-card.vue'
import type { ArticleInfo } from './simulator/inject'
import OnlyTitlebarLayout from '@/layouts/only-title-bar-layout.vue'
import type { Mabiao } from '@/libs/schema'

const $q = useQuasar()
onErrorCaptured((err) => {
  $q.notify({ type: 'negative', message: err.message })
})

const Visualize = defineAsyncComponent(() => import('./simulator/visualize-card.vue'))
const openVisualizeDialog = shallowRef(false)

const articleData = shallowRef<ArticleInfo>({
  name: '',
  txt: '',
})

const mabiaoData = shallowRef<Mabiao | null>(null)
const mabiaoData2 = shallowRef<Mabiao | null>(null)

const readyToRun = computed(() => !!(articleData.value.txt && mabiaoData.value && mabiaoData2.value))
</script>

<template>
  <OnlyTitlebarLayout
    title="测评工具"
    @drop.prevent
    @dragover.prevent
    @dragleave.prevent
    @dragenter.prevent
  >
    <template #toolbar>
      <QBtn :icon="mdiHelpCircle" color="grey-7" round flat>
        <QTooltip>帮助文档</QTooltip>
      </QBtn>
      <QBtn :icon="mdiCog" round flat color="grey-7">
        <QTooltip>赛码器设置</QTooltip>
      </QBtn>
    </template>

    <div class="column items-center full-width" style="max-width: 60rem;">
      <!-- 赛码文章卡片 -->
      <div class="col q-pa-sm full-width">
        <h2 class="text-h6 text-blue-grey-6">
          赛文
        </h2>
        <ArticleCard @value="v => articleData = v" />
      </div>
      <div class="col row justify-center full-width">
        <!-- 主码表卡片 -->
        <div class="col-12 col-md q-pa-sm">
          <h2 class="text-h6 text-blue-grey-6">
            主码表
          </h2>
          <SchemaCard @value="sch => mabiaoData = sch" />
        </div>
        <!-- 副码表卡片 -->
        <div class="col-12 col-md q-pa-sm">
          <h2 class="text-h6 text-blue-grey-6">
            副码表
          </h2>
          <SchemaCard @value="sch => mabiaoData2 = sch" />
        </div>
      </div>
      <!-- 开始赛码按钮 -->
      <div class="col row flex-center full-width q-my-lg">
        <QBtn
          :disable="!readyToRun"
          :color="readyToRun ? 'primary' : 'blue-grey' "
          label="赛 码" rounded class="col-6"
          @click="() => { openVisualizeDialog = true }"
        />
      </div>
    </div>
    <!-- 赛码结果弹窗 -->
    <QDialog v-model="openVisualizeDialog" maximized>
      <Visualize
        v-if="readyToRun"
        :article="articleData"
        :mb="mabiaoData!"
        :mb2="mabiaoData2!"
      />
    </QDialog>
  </OnlyTitlebarLayout>
</template>
