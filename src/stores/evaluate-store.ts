import { defineStore } from 'pinia'

export const useEvaluateStore = defineStore('evaluate-store', {
  state: () => ({
    racer: {
      singleMode: false,
    },
    pagination: {
      rowsPerPage: 20,
    },
  }),
  persist: true,
})
