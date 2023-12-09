<template>
  <QTooltip v-bind="$attrs" :offset="[0, -4]" class="bg-dark shadow-4 q-px-md">
    <slot />
  </QTooltip>
</template>
