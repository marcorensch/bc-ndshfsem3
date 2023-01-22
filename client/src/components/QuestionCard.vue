<template v-if="item">
  <div class="question-card card w-100" :class="{solved : item.accepted_id}">
    <span class="card-header">
      {{ item.categoryTitle }}
    </span>
    <div class="card-body">
      <div class="question-content" v-html="strippedContent"></div>
      <div v-if="item.tags.length > 0" class="tags">
        <div v-for="tag in item.tags" :key="tag.id" class="tag">{{ tag.title }}</div>
      </div>
      <div class="btn-section">
        <router-link :to="{name: 'Question View', params:{id: item.id}}" class="btn btn-primary float-start col">
          <span v-if="item.accepted_id">See answers</span>
          <span v-else>I can answer this!</span>
        </router-link>
        <router-link to="/" v-if="item.answersCount">
          <button class="btn btn-primary float-end col">Show {{ item.answersCount }} Answers </button>
        </router-link>
      </div>
    </div>
    <div class="card-body">
      <span>asked: {{ new Date(item.created_at).toLocaleString() }}</span>
      <span class="float-end">by
        {{ item.anonymous || !item.username ? "Anonym" : item.username }}
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
      const length = 400;
      return (string.length > length) ? string.slice(0, length-1).trim() + '...' : string;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>