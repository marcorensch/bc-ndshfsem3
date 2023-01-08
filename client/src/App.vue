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
:root {
  --primary: #0CAFFF;
  --grey: #64748b;
  --dark: #292e40;
  --dark-alt: #334155;
  --light: #f1f5f9;
  --sidebar-width: 300px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--light);
}

button {
  appearance: none;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;

  &.default {
    font-size: .8rem;
    background-color: var(--dark);
    border-radius: 2px;
    color: (var(--light));
    padding: 7px 10px;
    margin: 5px;
    border: none;
    cursor: pointer;
    width: 100px;
    transition: 0.2s ease-out;

    &:hover {
      background-color: var(--primary);
    }
  }
}

.app-content {
  display: flex;
  main {
    flex: 1 1 0;
    padding: 2rem;
    min-width: 0;

    @media (max-width: 768px) {
      padding-left: 6rem;
    }

  }

}

</style>
