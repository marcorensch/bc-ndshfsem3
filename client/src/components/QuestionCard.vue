<template>
  <div class="card w-100">
    <span class="card-header" >
      {{item.id}} - {{item.categoryTitle}}
    </span>
    <div class="card-body">
      <div class="question-content" v-html="item.content"></div>
      <div v-if="item.tags.length > 0" class="tags">
        <div v-for="tag in item.tags" :key="tag.id" class="tag">{{tag.title}}</div>
      </div>
      <div class="btn-section">
        <router-link :to="{name: 'Question View', params:{id: item.id}}" class="btn btn-primary float-start col">
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




</style>