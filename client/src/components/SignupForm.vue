<template>
  <div class="container">
    <h3>Signup form</h3>
    <form ref="form" @submit.prevent="handleSubmit">
      <!-- Trick the browser into NOT auto-filling the form -->
      <input type="text" style="display:none">
      <input type="password" style="display:none">

      <div class="form-group">
        <div class="row p-4">
          <div class="col-sm-6">
            <label for="firstname">Firstname:</label>
            <input type="text" class="form-control" id="firstname" v-model="firstname">
            <span v-if="v$.firstname.$error" :class="`${v$.firstname.$error ? 'error-message' : ''}`">{{ v$.firstname.required.$message }}</span>
          </div>
          <div class="col-sm-6">
            <label for="lastname">Lastname:</label>
            <input type="text" class="form-control" id="lastname" v-model="lastname">
            <span v-if="v$.lastname.$error" :class="`${v$.lastname.$error ? 'error-message' : ''}`">{{ v$.lastname.required.$message }}</span>
          </div>
        </div>

        <div class="row p-4">
          <div class="col-sm-6">
            <label for="email">Email:</label>
            <input type="email" class="form-control" id="email" v-model="email" @blur="checkIfEmailExist">
            <span v-if="v$.email.$error"
                  :class="`${v$.email.$error ? 'error-message' : ''}`">{{ v$.email.email.$message }}</span>
          </div>
          <div class="col-sm-6">
            <label for="username">Username:</label>
            <input type="text" class="form-control" id="username" v-model="username" @blur="checkIfUsernameExist">
            <span v-if="v$.username.$error"
                  :class="`${v$.username.$error ? 'error-message' : ''}`">{{ v$.username.required.$message }}</span>
          </div>
        </div>

        <div class="row p-4">
          <div class="col-sm-6">
            <label for="new-password">New password:</label>
            <input type="password" class="form-control" id="new-password" v-model="password.newPassword">
            <span v-if="v$.password.newPassword.$error"
                  :class="`${v$.password.newPassword.$error ? 'error-message' : ''}`">{{
                "Min. " + v$.password.newPassword.minLength.$params.min + " characters"
              }}</span>
          </div>
          <div class="col-sm-6">
            <label for="confirm-password">Confirm password:</label>
            <input type="password" class="form-control" id="confirm-password" v-model="password.confirmPassword">
            <span v-if="v$.password.confirmPassword.$error"
                  :class="`${v$.password.confirmPassword.$error ? 'error-message' : ''}`">{{
                "Not same password"
              }}</span>
          </div>
        </div>
      </div>
      <div class="p-4 align-center text-center">
        <button type="submit" class="btn form-button">Sign up</button>
      </div>
    </form>
  </div>
</template>

<script>
import {useVuelidate} from "@vuelidate/core";
import {required, minLength, sameAs, email} from "@vuelidate/validators";
import ErrorMessageContainer from "@/components/ErrorMessageContainer";
import NotificationModal from "@/components/NotificationModal";
import {useUserStore} from "@/stores/UserStore";

import axios from "axios";
import {useToast} from "vue-toastification";

export default {
  inject: ['host'],
  setup() {
    return {v$: useVuelidate()}
  },
  name: "SignupForm",
  components: {
    ErrorMessageContainer,
    NotificationModal
  },
  data() {
    return {
      showNotificationModal: false,
      confirmMessage: "",
      errorMessage: "",
      form: "",
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      password: {
        newPassword: '',
        confirmPassword: '',
      },
      submitConfirmText: "Thank you for signing up!",
      userStore: useUserStore(),
      toast: useToast()
    }
  },
  validations() {
    return {
      firstname: {
        required: required,
      },
      lastname: {
        required: required,
      },
      email: {
        required: required,
        email: email,
      },
      username: {
        required: required,
      },
      password: {
        newPassword: {
          required: required,
          minLength: minLength(8),
        },
        confirmPassword: {
          required: required,
          sameAsPassword: sameAs(this.password.newPassword),
        },
      },
    }
  },
  computed: {
    isLoggedIn() {
      return this.userStore.getTokens.token !== null || '';
    }
  },
  mounted() {
    if (this.isLoggedIn) {
      this.$router.push({name: 'Home'})
    }
  },
  methods: {
    async handleSubmit() {
      const valid = await this.v$.$validate();
      if (valid) {
        try {
          this.submitForm();
          this.$refs.form.reset();
        } catch (e) {
          this.toast.error("Error submitting form")
          console.log(e)
        }
      } else {
        this.toast.error("Please fill in all fields correctly")
      }
    },
    checkIfUsernameExist() {
      axios.post(this.host + '/users/check', {
        username: this.username
      })
          .then(response => {
            if (response.data.payload.exists) {
              this.toast.warning("Username already exists")
              this.v$.username.$error = true;
              this.v$.username.required.$message = "Username already exist";
            }
          })
          .catch(error => {
            console.log(error)
          })

    },
    checkIfEmailExist() {
      axios.post(this.host + '/users/check', {
        email: this.email
      })
          .then(response => {
            if (response.data.payload.exists) {
              this.toast.warning("Email already exist")
              this.v$.email.$error = true;
              this.v$.email.email.$message = "Email already exist";
            }
          })
          .catch(error => {
            console.log(error)
          })

    },
    submitForm() {
      axios.post(this.host + '/auth/register', {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        username: this.username,
        password: this.password.newPassword,
      })
          .then((response) => {
            if (response.status === 201) {
              this.toast.success("Account registered successfully, you can now login")
              this.$router.push({name: 'Home'})
            }
          })
          .catch((error) => {
            throw error
          });
    }
  },

}
</script>

<style lang="scss" scoped>

</style>