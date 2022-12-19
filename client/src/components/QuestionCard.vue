<template>
  <div class="card w-100">
    <h5 class="card-header" >
      Category: {{question.category_id}}
    </h5>
    <div class="card-body">
      <h5 class="card-title">{{question.question}}</h5>
      <a href="#" class="btn btn-primary">Show X Answers</a>
    </div>
    <div class="card-footer ">
      <span>created:{{question.created}}</span>
      <span class="float-end">by <a href="#">{{question.created_by}}</a></span>
  </div>
  </div>
</template>

<script>

export default {
  name: "QuestionCard",
  components: {},
  props: {
    question: {
      type: Object,
      required: true
    },

  },
  data() {
    return {


    };

  },
  created() {

  },
  methods: {

  },

}
</script>

<style lang="scss" scoped>


</style>