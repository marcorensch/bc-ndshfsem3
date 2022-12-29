<template>
  <div class="login">
    <div class="form-container">
      <label for="username">Username</label>
      <input id="username" type="text" placeholder="Enter Username" name="username" v-model="username" required>

      <label for="password">Password</label>
      <input id="password" type="password" placeholder="Enter Password" name="password" v-model="password" required>
      <label>
        <input type="checkbox" checked="checked" name="remember" v-model="checked" @change="rememberUsername">
        Remember me
      </label>
    </div>

    <div class="footer">
      <router-link to="/register">
        <button type="button" class="form-button" @click="$emit('close')">Register</button>
      </router-link>

      <button @click="doLogin" class="form-button">Login</button>
    </div>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "Login",
  created() {
    this.username = localStorage.getItem("username") || "";
    this.password = "";
    this.checked = localStorage.getItem("checked")
  },

  methods: {
    rememberUsername() {
      localStorage.setItem("checked", this.checked)
      if (!this.checked) {
        localStorage.removeItem("username")
      } else {
        localStorage.setItem("username", this.username);
      }
    },
    doLogin() {
      // @todo: validate input
      axios.post(this.host + "/auth/login", {
        username: this.username,
        password: this.password
      }).then((response) => {
        if(response.data.token) {
          localStorage.setItem("token", response.data.token);
        //  this.$router.push("/");
        }
      }).catch((error) => {
        console.log(error);
      })
    }

  },
}
</script>

<style scoped>

</style>