<script setup lang="ts">
import { computed, shallowRef, watchEffect } from 'vue'
import { mdiCounter, mdiPlusBoxOutline, mdiTextBoxEditOutline, mdiTrashCanOutline } from '@quasar/extras/mdi-v7'
import LoadFile from 'components/loadFile/LoadFile.vue'
import RawFile from 'src/libs/platforms/rawFile'
import { formatYiWan } from 'libs/utils/format'
import { createEmptySchema } from 'libs/schema'
import { removeFileNameExt } from 'src/libs/utils/string'

interface ArticleData {
  name: string
  txt: string
}
const emits = defineEmits<{
  value: [value: ArticleData]
}>()

const openArticle = shallowRef(false)

const articleData = shallowRef({ name: '', txt: '' })

watchEffect(() => {
  emits('value', articleData.value)
})

function onDropArticle(e: DragEvent) {
  const f = e.dataTransfer?.files[0]
  if (!f)
    throw new Error('无法识别文件')
  const rawfile = new RawFile(f)
  rawfile.getText().then((txt) => {
    articleData.value = {
      txt,
      name: removeFileNameExt(rawfile.name),
    }
  })
}

const wrapInSchema = computed(() => {
  const result = createEmptySchema()
  result.cfg = articleData.value
  return result
})
</script>

<template>
  <!-- 赛码文章卡片 -->
  <QCard
    style="height: 15rem;"
    @drop.prevent="onDropArticle"
    @dragover.prevent
    @dragleave.prevent
    @dragenter.prevent
  >
    <template v-if="!articleData.txt">
      <div
        class="column flex-center cursor-pointer bg-grey-1" style="height: 100%;padding-bottom: 1rem;"
        @click="e => openArticle = true"
      >
        <div class="row flex-center">
          <QIcon :name="mdiPlusBoxOutline" size="xl" color="grey" />
        </div>
        <div class="text-grey-7 q-mt-sm text-center">
          拖动文件至此，或者点击详细操作
        </div>
      </div>
    </template>
    <!-- 有数据之后显示卡片 -->
    <template v-else>
      <QCardSection style="height:11.7rem ;">
        <div class="text-overline text-truncate" v-text="articleData.name" />
        <div class="text-grey" style="height: 5.5rem;overflow: hidden;" v-text="articleData.txt.slice(0, 200)" />
        <div class="text-subtitle2 text-blue-7 q-mt-sm">
          {{ formatYiWan(articleData.txt.length) }}字符
        </div>
      </QCardSection>
      <QCardActions class="bg-blue-grey-1 row">
        <QBtn flat class="col" :icon="mdiCounter">
          <QTooltip>
            统计汉字字数、常用字数量……
          </QTooltip>
          统 计
        </QBtn>
        <QBtn flat class="col" :icon="mdiTextBoxEditOutline" @click="e => openArticle = true">
          <QTooltip>
            修改标题和文章内容，可以去除空格……
          </QTooltip>
          编 辑
        </QBtn>
        <QBtn
          flat color="negative" class="col" :icon="mdiTrashCanOutline"
          @click="e => { articleData = { name: '', txt: '' } }"
        >
          <QTooltip>
            删除赛码文章
          </QTooltip>
          删 除
        </QBtn>
      </QCardActions>
    </template>
  </QCard>

  <QDialog v-model="openArticle">
    <LoadFile
      :preset="wrapInSchema"
      @value="v => {
        articleData.txt = v.cfg.txt !
        articleData.name = v.cfg.name!
        openArticle = false
      }"
    />
  </QDialog>
</template>
