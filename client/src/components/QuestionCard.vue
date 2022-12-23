<template>
  <div class="card w-100">
    <span class="card-header" >
      Category: {{question.category_id}}
    </span>
    <div class="card-body">
      <p class="card-title question-content">{{question.question}}</p>
      <div class="btn-section">
        <router-link to="/answer/new">
          <button class="btn btn-primary float-start col">Create Answer</button>
        </router-link>
        <router-link to="/">
          <button class="btn btn-primary float-end col">Show X Answers</button>
        </router-link>
      </div>


      </div>

    <div class="card-body">
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

.card {
  margin: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: 0.3s ease-out;

  .card-header {
    background-color: var(--dark);
    color: var(--light);
    font-size: 1rem;
  }
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    transition: 0.3s ease-out;
  }
}

.question-content{
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 3rem;
}

.btn{
  font-size: 1rem;
  background-color: var(--dark);
  border-radius: 2px;
  color: (var(--light));
  padding: 14px 20px;
  margin: 10px 10px;
  border: none;
  cursor: pointer;
  width: 200px;
  transition: 0.2s ease-out;

  &:hover {
    background-color: var(--primary);
  }
}
@media (max-width: 768px) {
 .btn-section{
   display: flex;
   flex-direction: column;
   align-items: center;
 }

  .btn {
    width: 200px;
    font-size: 1rem;
    float: none !important;
  }
}



</style>