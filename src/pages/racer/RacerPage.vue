<script lang="ts" setup>
import LoadFiles from 'components/racer/LoadFiles.vue'
import { setTitle } from 'src/libs/utils'

setTitle('测评工具')
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-btn to="/" flat square title="形码盒子主页">
            <q-avatar square>
              <img src="~assets/icon.png">
            </q-avatar>
          </q-btn>
          测评工具
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="row justify-center">
        <LoadFiles />
      </div>
    </q-page-container>
  </q-layout>
</template>
