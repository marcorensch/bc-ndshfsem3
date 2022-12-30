<template>
  <QuestionCard v-for="question in questionList" :item="question" />
  <Pagination :total="pagination.total" :page="pagination.page" @pageChange="handlePageChange" />
</template>

<script>
import axios from "axios";
import QuestionCard from "@/components/QuestionCard.vue";
import Pagination from "@/components/Pagination.vue";

export default {
  name: "ListOfQuestions",
  inject: ["host"],
  components: {
    QuestionCard,
    Pagination,
  },
  data() {
    return {
      pagination: {
        page: 1,
        perPage: 2,
        total: 0,
      },
      questionList: [],
    };
  },
  mounted() {
    this.getQuestions();
  },
  methods: {
    handlePageChange(page) {
      this.pagination.page = page;
      this.getQuestions();
    },
    getQuestions() {
      axios.get(this.host + "/questions", {
        params: {count: this.pagination.perPage, page: this.pagination.page}
      })
          .then((response) => {
            console.log(response)
            this.pagination.total = Math.ceil(response.data.payload.total / this.pagination.perPage);
            this.questionList = response.data.payload.questions;
            console.log(this.pagination)
          })
          .catch((error) => {
            console.log(error);
          });
    },
  }
}
</script>

<style scoped>

</style>