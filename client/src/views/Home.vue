<template>
  <main class="home-page">
    <ListOfQuestions />
  </main>
</template>

<script>
import ListOfQuestions from "@/components/ListOfQuestions.vue";

export default {
  name: "Home",
  components: {
    ListOfQuestions,
  },
  data() {
    return {};
  },
  created() {},
  methods: {}
}
</script>