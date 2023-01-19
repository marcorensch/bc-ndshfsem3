<template>
  <div class="app">
    <Header/>
    <div class="app-content">
      <Sidebar/>
      <LoginModal/>
      <router-view :key="$route.fullPath" />
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LoginModal from "@/components/LoginModal.vue";
import { useToast } from 'vue-toastification'

export default {
  name: 'App',
  components: {
    LoginModal,
    Sidebar,
    Header,
  },
  setup() {
    // Get toast interface
    const toast = useToast();

    // Use it!
    toast("I'm a toast!");

    // or with options
    toast.success("My toast content", {
      timeout: 2000
    });
    // These options will override the options defined in the "app.use" plugin registration for this specific toast

    // Make it available inside methods
    return { toast }
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss">
@import "@/assets/styles/app.scss";


</style>
