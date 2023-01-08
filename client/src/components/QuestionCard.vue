<template>
  <div class="card w-100">
    <span class="card-header" >
      {{item.id}} - {{item.categoryTitle}}
    </span>
    <div class="card-body">
      <div class="question-content">{{strippedContent}}</div>
      <div v-if="item.tags.length > 0" class="tags">
        <div v-for="tag in item.tags" :key="tag.id" class="tag">{{tag.title}}</div>
      </div>
      <div class="btn-section">
        <router-link :to="{name: 'New Answer', params:{id: item.id}}" class="btn btn-primary float-start col">
          I can answer this!
        </router-link>
        <router-link to="/" v-if="item.answersCount">
          <button class="btn btn-primary float-end col">Show {{item.answersCount}} Answers</button>
        </router-link>
      </div>


      </div>

    <div class="card-body">
      <span>asked: {{new Date(item.created_at).toLocaleString()}}</span>
      <span class="float-end">by
        {{item.anonymous || !item.username ? "Anonym" : item.username}}
      </span>
  </div>
  </div>
</template>

<script>

export default {
  name: "QuestionCard",
  components: {},
  props: {
    item: {
      type: Object,
      required: true
    },
  },
  computed: {
    strippedContent() {
      let regex = /(<([^>]+)>)/ig;
      let string = this.item.content.replace(regex, "");
      const length = 100;
      return (string.length > length) ? string.slice(0, length-1).trim() + '...' : string;
    }
  },
  data() {
    return {


    };

  },
  mounted() {

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

.tags{
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: end;
  margin-bottom: .5rem;
  .tag{
    font-size: .8rem;
    background-color: var(--dark);
    color: var(--light);
    padding: 0.2rem .4rem;
    margin: 0.2rem;
    border-radius: 4px;
  }
}



</style>