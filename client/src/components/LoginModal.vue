<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="header">
            <h2>Login Form</h2>
            <router-link to="/">
            <button
                class="modal-default-button close-button"
                @click="$emit('close')">
              <font-awesome-icon icon="xmark"></font-awesome-icon>
            </button>
            </router-link>
          </div>


          <form action="/action_page.php" method="post">

            <div class="form-container">
              <label for="username">Username</label>
              <input type="text" placeholder="Enter Username" name="username" v-model="username" required>

              <label for="password">Password</label>
              <input type="password" placeholder="Enter Password" name="password" required>
              <label>
                <input type="checkbox" checked="checked" name="remember" v-model="checked" @change="rememberUsername">
                Remember me
              </label>
            </div>

            <div class="footer">
              <router-link to="/register">
                <button type="button" class="form-button" @click="$emit('close')">Register</button>
              </router-link>

              <button type="submit" class="form-button">Login</button>
            </div>


          </form>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: "LoginModal",
  props: {
    show: Boolean
  }, data() {
    return {
      username: "",
      checked: false,
    }
  },
  created() {
    this.username = localStorage.getItem("username") || "";
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

    }

  },
}
</script>

<style lang="scss" scoped>

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  height: 500px;
  margin: 0 auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.close-button {
  font-size: 1.5rem;

  &:hover {
    color: var(--primary);
  }
}

.form-container {
  padding: 16px
}

form {
  border: 3px solid #f1f1f1;
}

label {
  font-weight: bold;
  margin-top: 10px;
}

input[type=text], input[type=password] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
  border-radius: 2px;

  &:focus {
    border: 1px solid var(--primary);
    box-shadow: none;

  }
}

.footer {
  display: flex;
  margin-top: 2rem;
}

.form-button {
  font-size: 1.5rem;
  background-color: var(--dark);
  border-radius: 2px;
  color: (var(--light));
  padding: 14px 20px;
  margin: 10px 10px;
  border: none;
  cursor: pointer;
  width: 200px;

  &:hover {
    background-color: var(--primary);
  }
}

.footer-link {
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
}

.forgot {
  font-size: 1rem;

  a {
    margin-left: 5px;
  }


}

.modal-body {
  margin: 20px 0;
}


/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .modal-container {
    width: 80%;
    height: 80%;
  }

  .form-button {
    width: 50%;
    font-size: 1rem
  }

}
</style>