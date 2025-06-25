import { defineStore } from "pinia";
import MicroModal from "micromodal";

export const useModalStore = defineStore("modal", {
  state: () => ({
    data: null,
  }),
  actions: {
    open(project) {
      this.data = project;
      MicroModal.show("modal-1");
    },
    close() {
      MicroModal.close("modal-1");
      this.data = null;
    },
  },
});
