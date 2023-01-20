<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h2>Login Form</h2>
            <button class="modal-default-button close-button" @click="$emit('close')">
              <font-awesome-icon icon="xmark" />
            </button>
          </div>
          <ErrorMessageContainer :string="errorMessage"/>
          <form>
            <div class="form-container">
              <label for="username">Username</label>
              <input id="username" type="text" placeholder="Enter Username" name="username" v-model="username" required>
              <label for="password">Password</label>
              <input id="password" type="password" placeholder="Enter Password" name="password" v-model="password" required>
              <label>
                <input type="checkbox" checked="checked" name="remember" v-model="checked"> Remember me
              </label>
            </div>
            <div class="modal-footer">
              <div>
              <router-link to="/register">
                <button type="button" class="form-button" @click="$emit('close')">Register</button>
              </router-link>
              </div>
              <div>
                <button @click="doLogin" class="form-button">Login</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import axios from "axios";
import ErrorMessageContainer from "@/components/ErrorMessageContainer.vue";
import {useUserStore} from "@/stores/UserStore";

export default {
  name: "LoginModal",
  inject: ['host'],
  props: {
    show: Boolean
  },
  components: {
    ErrorMessageContainer
  },
  data() {
    return {
      errorMessage: "",
      username: "",
      password: "",
      checked: false,
      userStore: useUserStore()
    }
  },
  mounted() {
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
    doLogin(event) {
      event.preventDefault();
      this.rememberUsername()
      axios.post(this.host + "/auth/login", {}, {
        headers: {
          Authorization: "Basic " + btoa(this.username + ":" + this.password)
        }
      }).then((response) => {
        if (response.data.success) {
          this.userStore.setUser(response.data.payload.user)
          if (response.data.payload.token) this.userStore.setToken(response.data.payload.token)
          if (response.data.payload.refreshToken) this.userStore.setRefreshToken(response.data.payload.refreshToken)
          this.$emit("close");
        } else {
          console.log(response.data)
        }
      }).catch(err => {
        this.errorMessage = err.response.data.message;
      })
    }
  },
}
</script>

<style lang="scss" scoped>

</style>