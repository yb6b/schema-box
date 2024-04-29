<script lang="ts" setup>
import { useSetTitle } from '@/libs/hooks'

defineProps({
  title: {
    type: String,
    default: '',
  },
})

useSetTitle()
</script>

<template>
  <QLayout view="hHh lpR fFf" class="bg-grey-3">
    <QHeader reveal elevated class="bg-white text-dark">
      <QToolbar>
        <QBtn to="/" flat square title="形码盒子主页">
          <QAvatar square>
            <img src="@/assets/icon.svg">
          </QAvatar>
        </QBtn>

        <QToolbarTitle style="letter-spacing: 2px;" class="text-blue-grey-9">
          {{ title }}
        </QToolbarTitle>
        <slot name="toolbar" />
      </QToolbar>
    </QHeader>

    <QPageContainer>
      <div class="flex flex-center container">
        <slot />
      </div>
    </QPageContainer>
  </QLayout>
</template>
