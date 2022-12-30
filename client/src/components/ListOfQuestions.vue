<template>
  <QuestionCard v-for="question in questionList " :item=question />
</template>

<script>
import axios from "axios";
import QuestionCard from "@/components/QuestionCard.vue";

export default {
  name: "ListOfQuestions",
  inject: ["host"],
  components: {
    QuestionCard,
  },
  data() {
    return {
      questionList: [],
    };
  },
  mounted() {
    this.getQuestions();
  },
  methods: {
    getQuestions() {
      console.log("getQuestions");
      console.log(this.host);
      axios.get(this.host + "/questions")
        .then((response) => {
          console.log(response)
          this.questionList = response.data.payload.questions;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
}
</script>

<style scoped>

</style>