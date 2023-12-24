<script setup lang="ts">
import { inject } from 'vue'
import { mdiClipboardOutline } from '@quasar/extras/mdi-v7'
import { nanoid6 } from 'libs/utils'
import { sliceString } from 'libs/utils/string'
import { jResultRef } from '../inject'

const res = inject(jResultRef)!

function readClipboard() {
  (async () => {
    const text = await navigator.clipboard.readText()
    res.value.txt = text
    res.value.name = `剪切_${sliceString(text, 0, 6)}_${nanoid6()}`
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
  <div v-if="res.txt" class="q-mt-sm text-grey-6">
    已读取「{{ sliceString(res.txt, 0, 12) }}……」 共
    {{ res.txt.length }} 字
  </div>
</template>
