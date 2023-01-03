<template>
  {{ question }}
</template>

<script>
import axios from "axios";

export default {
  name: "Edit",
  inject: ["host"],
  props: {
    question_id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      question:"",
      errorMessage: "",
    };
  },
  mounted() {
    this.getQuestionById(this.$route.params.id);
  },
  methods: {
    getQuestionById(id){
      if(!id) return;
      axios.get(`${this.host}/questions/${id}`)
      .then((response) => {
        this.question = response.data.question.content;
      })
      .catch((err) => {
        console.log(err);
      });
    },
  },
}
</script>

<style scoped>

</style>