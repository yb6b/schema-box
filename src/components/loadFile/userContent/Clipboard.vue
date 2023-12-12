<script setup>
import { inject } from 'vue'
import { mdiClipboardOutline } from '@quasar/extras/mdi-v7'
import { nanoid6 } from 'libs/utils'
import { sliceString } from 'libs/utils/string'

const res = inject('result')

function readClipboard() {
  (async () => {
    const text = await navigator.clipboard.readText()
    res.value.cfg.txt = text
    res.value.cfg.name = `剪切_${sliceString(text, 0, 6)}_${nanoid6()}`
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
  <div v-show="res.cfg.txt" class="q-mt-sm text-grey-6">
    已读取「{{ sliceString(res.cfg.txt, 0, 12) }}……」 共
    {{ res.cfg.txt.length }} 字
  </div>
</template>
