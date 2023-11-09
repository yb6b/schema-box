<script lang="ts" setup>
import LoadFiles from 'components/racer/LoadFiles.vue'
import { setTitle } from 'src/libs/utils'

setTitle('测评工具')
</script>

<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="bg-primary text-white">
      <QToolbar>
        <QToolbarTitle>
          <QBtn to="/" flat square title="形码盒子主页">
            <QAvatar square>
              <img src="~assets/icon.png">
            </QAvatar>
          </QBtn>
          测评工具
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
