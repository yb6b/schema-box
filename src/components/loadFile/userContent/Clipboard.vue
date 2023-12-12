<script setup>
import { inject } from 'vue'
import { mdiClipboardOutline } from '@quasar/extras/mdi-v7'
import { nanoid6 } from 'libs/utils'

const res = inject('result')

function readClipboard() {
  (async () => {
    const text = await navigator.clipboard.readText()
    res.value.text = text
    res.value.option = { name: `剪切板文本_${nanoid6()}` }
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
  <div v-show="res.text" class="q-mt-sm text-grey-6">
    已读取「{{ [...res.text].slice(0, 12).join("") }}……」 共
    {{ [...res.text].length }} 字
  </div>
</template>
