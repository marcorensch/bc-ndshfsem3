<template>

  <main class="home-page">

    <QuestionCard v-for="question in questionList " :question =question />
  </main>
</template>

<script>
import QuestionCard from "@/components/QuestionCard";
import questions from "../../../server/demo/questions.mjs";

export default {
  name: "Home",
  components: {
    QuestionCard,

  },
  data() {
    return {
      questionList: [],

    };
  },
  created() {
    this.getDemoData();

  },
  methods: {
    getDemoData() {
      console.log(questions)
      this.questionList = questions;

    },



  }
}
</script>

<style lang="scss" scoped>

.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;

}

</style>