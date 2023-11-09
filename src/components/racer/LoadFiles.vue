<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { mdiTextBoxEditOutline } from '@quasar/extras/mdi-v7'
import LoadFileDialog from './loadFile/LoadFileDialog.vue'

const openArticle = ref(false)
const articleData = reactive({
  name: '',
  content: '',
  length: 2,
})

const openSchema = ref(false)
const schemaData = reactive({
  name: '',
  content: '',
  length: 2,
  options: {},
})

function briefContent(content: string, CharLengthBoundary = 40): string {
  const result = Array(CharLengthBoundary)
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
  <QList bordered padding style="min-width:26rem">
    <QItemLabel header>
      赛文
    </QItemLabel>
    <QItem clickable @click="openArticle = true">
      <QItemSection>
        <QItemLabel>
          {{ articleData.name }}
          <QBadge
            rounded
            color="blue-grey-5"
            :label="`${articleData.length} 字`"
          />
        </QItemLabel>
        <QItemLabel caption>
          {{ briefContent(articleData.content) }}
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
      <QItemSection>
        <QItemLabel>
          {{ schemaData.name }}
          <QBadge
            rounded
            color="blue-grey-5"
            :label="`${schemaData.length} 行`"
          />
        </QItemLabel>
        <QItemLabel caption>
          {{ briefContent(schemaData.content) }}
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
      schemaData.name = v.options.name
      schemaData.content = v.content
      schemaData.length = v.options.cl
    }"
  />
  <LoadFileDialog v-model:dialog="openArticle" @value="console.log " />
</template>
