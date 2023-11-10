<script lang="ts" setup>
import LoadFiles from 'components/racer/LoadFiles.vue'
import { setTitle } from 'src/libs/utils'

setTitle('测评工具')
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
            测评工具
          </span>
        </QToolbarTitle>
      </QToolbar>
    </QHeader>

    <QPageContainer>
      <div class="row justify-center">
        <LoadFiles />
      </div>
    </QPageContainer>
  </QLayout>
</template>
