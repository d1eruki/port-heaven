import { defineStore } from 'pinia'
import MicroModal from 'micromodal'

export const useModalStore = defineStore('modal', {
  state: () => ({
    data: null,
  }),
  actions: {
    open(payload) {
      this.data = payload
      MicroModal.show('project-modal')
    },
    close() {
      MicroModal.close('project-modal')
    },
  },
})
