<template>
  <div class="pagination">
    <button class="btn default" @click="pageChange(page - 1)" v-if="page > 1">
      <font-awesome-icon icon="chevron-left" />
    </button>
    <button class="btn default" @click="pageChange(page + 1)" v-if="page < total">
      <font-awesome-icon icon="chevron-right" />
    </button>
  </div>
</template>

<script>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "Pagination",
  components: {FontAwesomeIcon},
  props: {
    total: {
      type: Number,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    }
  },
  emits: ["pageChange"],
  methods: {
    pageChange(page) {
      this.$emit("pageChange", page);
    },
  },
}
</script>

<style scoped>

</style>