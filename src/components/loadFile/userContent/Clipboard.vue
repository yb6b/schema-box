<script setup>
import { ref } from 'vue'
import { mdiClipboardOutline } from '@quasar/extras/mdi-v7'
import RawFile from 'libs/platforms/rawFile'
import { nanoid6 } from 'libs/utils'

const e = defineEmits(['value'])
const contentRef = ref('')
function readClipboard() {
  (async () => {
    const text = await navigator.clipboard.readText()
    contentRef.value = text
    e('value', new RawFile(text, `剪切板文本_${nanoid6()}`))
  })()
}
</script>

<template>
  <div class="row justify-center">
    <QBtn
      class="col-10 text-overline q-py-sm"
      rounded
      push
      size="md"
      color="secondary"
      label="读取剪切板"
      :icon="mdiClipboardOutline"
      @click="readClipboard"
    />
  </div>
  <div v-show="contentRef" class="q-mt-sm text-grey-6">
    已读取「{{ [...contentRef].slice(0, 12).join("") }}……」 共
    {{ [...contentRef].length }} 字
  </div>
</template>
