<template>
  <main class="register-page">
    <SignupForm />
  </main>
</template>

<script>
import SignupForm from "@/components/SignupForm.vue";

export default {
  name: "RegisterView",
  components: {
    SignupForm,
  }
}
</script>

<style scoped>

</style>