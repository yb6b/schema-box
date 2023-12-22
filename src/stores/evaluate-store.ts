import { defineStore } from 'pinia'
import type { Schema } from 'src/libs/schema'

export const useEvaluate = defineStore('evaluate-store', {
  state: () => ({
    racer: {
      singleMode: false,
    },
  }),
  persist: true,
})
