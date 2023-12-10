<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import type { ChartData, CoreChartOptions } from 'chart.js'
import { BarElement, CategoryScale, Chart as ChartJS, Colors, Legend, LinearScale, Title, Tooltip } from 'chart.js'

defineProps<{
  title: string
  labels: string[]
  datasets: ChartData<'bar', (number | [number, number] | null)[], unknown>['datasets']
  onClick?: CoreChartOptions<'bar'>['onClick']
}>()

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Colors)
</script>

<template>
  <Bar
    :data="{
      labels,
      datasets,
    }"
    :options="{
      onClick,
      responsive: true,
      interaction: { intersect: false },
      scales: {
        y: { beginAtZero: true },
      },
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
    }"
  />
</template>
