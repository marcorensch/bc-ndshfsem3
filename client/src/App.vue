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

export default {
  name: 'App',
  components: {
    LoginModal,
    Sidebar,
    Header,
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss">
@import "@/assets/styles/app.scss";


</style>
