<template>
  <div v-if="category" class="p-5 w-100">
    <h1>Category Questions for {{ category.title }}</h1>
    <div v-if="questions.length">
      <QuestionCard v-for="question in questions" :item="question"/>
      <Pagination :total="pagination.total" :page="pagination.page" @pageChange="handlePageChange"/>
    </div>
    <div v-else class="w-100 text-center">
      <div class="noContent">Oh! it looks like there is no content here.</div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import QuestionCard from "@/components/QuestionCard.vue";
import Pagination from "@/components/Pagination.vue";

export default {
  name: "CategoryQuestions",
  components: {
    QuestionCard,
    Pagination,
  },
  inject: ["host"],
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      category: null,
      questions: [],
      pagination: {
        page: 1,
        perPage: 10,
        total: 0,
      },
    };
  },
  mounted() {
    this.getCategory();
    this.getCategoryQuestions();
  },
  methods:{
    handlePageChange(page) {
      this.pagination.page = page;
      this.getCategoryQuestions();
    },
    getCategory(){
      axios.get(this.host + '/categories/' + this.id).then(response => {
        this.category = response.data;
      })
    },
    getCategoryQuestions(){
      axios.get(this.host + '/questions/',{
        params: {
          category_id: this.id,
          count: this.pagination.perPage,
          page: this.pagination.page
        }
      }).then(response => {
        this.pagination.total = Math.ceil(response.data.payload.total / this.pagination.perPage);
        this.questions = response.data.payload.questions;
      })
    }
  }
}
</script>

<style scoped>
.noContent{
  padding: 80px;
  font-size: 20px;
  color: #999;
}
</style>