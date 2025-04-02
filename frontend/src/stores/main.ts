import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
  return {
    user: 'tchovis',
  }
})
