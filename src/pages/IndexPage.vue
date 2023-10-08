<script lang="ts" setup>
import { setTitle } from 'libs/utils'

setTitle('形码盒子', '')
</script>

<template>
  <div
    class="column items-center justify-evenly bg-grey-7"
    style="height:100vh;letter-spacing: 2px;"
  >
    <q-btn push glossy to="racer" color="primary" size="xl" class="q-px-lg" rounded>
      赛码器
    </q-btn>
    <p>
      形码盒子是开源、非盈利的个人项目，由
      <a href="https://github.com/yb6b" target="_blank">yb6b</a>
      制作，遵循
      <a href="https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt" target="_blank">GPL-2.0</a>
      开源协议。
    </p>
  </div>
</template>
