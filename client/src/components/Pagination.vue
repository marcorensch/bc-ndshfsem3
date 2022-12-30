<template>
  <div class="pagination">
    <button class="btn btn-primary" @click="pageChange(page - 1)" :disabled="page === 1">Previous</button>
    <button class="btn btn-primary" @click="pageChange(page + 1)" :disabled="page === total">Next</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
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