<template>
<div class="header">

  <h1>Babylon Community</h1>
  <img src="../assets/logo.png" alt="logo">
</div>
</template>

<script>
export default {
  name: "Header"
}
</script>

<style lang="scss" scoped>
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--dark);
  color: var(--light);

  img{
    width: 50px;
  }
}

</style>