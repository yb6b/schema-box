import { defineStore } from 'pinia'

export const useEvaluate = defineStore('evaluate-store', {
  state: () => ({
    racer: {
      singleMode: false,
    },
  }),
  persist: true,
})
