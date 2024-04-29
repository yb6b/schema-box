<script setup lang="ts">
const k = ['1234567890', 'qwertyuiop', 'asdfghjkl;', 'zxcvbnm,./']
</script>

<template>
  <div class="column no-wrap content-center">
    <div v-for="j of k" :key="j" class="col row">
      <template v-for="i in j" :key="i">
        <div class="col">
          <slot :keyname="i" />
        </div>
      </template>
    </div>
  </div>
</template>
