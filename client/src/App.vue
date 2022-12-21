<template>
  <div class="app">
  <Header/>
  <div class="app-content">
    <Sidebar/>
    <router-view/>
  </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";


export default {
  name: 'App',
  components: {
    Sidebar,
    Header,

  },
  data() {
    return {

    }
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

  /*#3f71b8;*/

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
}

.app-content {
  display: flex;
  main {
    flex: 1 1 0;
    padding: 2rem;

    @media (max-width: 768px) {
      padding-left: 6rem;
    }

  }

}

</style>
