<script lang="ts" setup>
import { useSetTitle } from 'libs/hooks'

defineProps({
  title: {
    type: String,
    default: '',
  },
})

useSetTitle()
</script>

<template>
  <QLayout view="hHh lpR fFf" class="bg-blue-grey-1">
    <QHeader reveal elevated class="bg-grey-1 text-dark">
      <QToolbar>
        <QToolbarTitle>
          <QBtn to="/" flat square title="形码盒子主页">
            <QAvatar square>
              <img src="~assets/icon.svg">
            </QAvatar>
          </QBtn>
          <span style="letter-spacing: 2px;" class="text-blue-grey-9">
            {{ title }}
          </span>
          <slot name="toolbar" />
        </QToolbarTitle>
      </QToolbar>
    </QHeader>

    <QPageContainer>
      <div class="flex flex-center">
        <slot />
      </div>
    </QPageContainer>
  </QLayout>
</template>
