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
  actions: {
    setRowsPer(rowsPerPage: number) {
      this.pagination.rowsPerPage = rowsPerPage
    },
  },
  persist: true,
})
