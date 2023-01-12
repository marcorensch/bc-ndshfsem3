<template>
  <div class="container">
    <h3>Edit Account</h3>
    <form ref="form" @submit.prevent="handleSubmit">
      <div class="form-group ">

        <div class="row p-4">
          <div class="col-sm-6">
            <label for="firstname">Firstname:</label>
            <input type="text" class="form-control" id="firstname" v-model="firstname">
            <span v-if="v$.firstname.$error"
                  :class="`${v$.firstname.$error ? 'error-message' : ''}`">{{ v$.firstname.required.$message }}</span>
          </div>
          <div class="col-sm-6">
            <label for="lastname">Lastname:</label>
            <input type="text" class="form-control" id="lastname" v-model="lastname">
            <span v-if="v$.lastname.$error"
                  :class="`${v$.lastname.$error ? 'error-message' : ''}`">{{ v$.lastname.required.$message }}</span>
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
                  :class="`${v$.password.newPassword.$error ? 'error-message' : ''}`">{{ "Min. " + v$.password.newPassword.minLength.$params.min + " characters" }}</span>
          </div>
          <div class="col-sm-6">
            <label for="confirm-password">Confirm password:</label>
            <input type="password" class="form-control" id="confirm-password" v-model="password.confirmPassword">
            <span v-if="v$.password.confirmPassword.$error"
                  :class="`${v$.password.confirmPassword.$error ? 'error-message' : ''}`">{{ "Not same password" }}</span>
          </div>
        </div>
      </div>
      <div class="pl-4 p-2  row justify-content-center">
        <button type="submit" class="btn  text-center pl-4 pr-4">Save</button>
      </div>
    </form>
  </div>
</template>

<script>
import {useVuelidate} from "@vuelidate/core";
import {required, minLength, sameAs, email} from "@vuelidate/validators";
import axios from "axios";

export default {
  inject:['host'],

  setup() {
    return {v$: useVuelidate()}

  },

  name: "EditAccountForm",
  data() {
    return {
      form: "",
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      password: {
        newPassword: '',
        confirmPassword: '',
      },
      submitConfirmText:"Thank you for signing up!",

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
  methods: {
    async handleSubmit() {
      try{
        const valid =  await this.v$.$validate();
        console.log("result=" + valid);
        if (valid) {
          console.log("Form is valid => Submitted");
          // Submit form
          this.submitForm();
          console.log(response);
          this.$refs.form.reset();
          //todo show message if success

        } else {
          console.log('Form is invalid')
        }
        console.log(this.firstname, this.lastname, this.email, this.password.newPassword, this.password.confirmPassword)

      }catch (error) {
        console.log(error)
      }

    },
    checkIfUsernameExist() {
      axios.post(this.host + '/user/check', {
        username: this.username
      })
          .then(response => {
            if (response.data){
              console.log("Username already exist")
              this.v$.username.$error = true;
              this.v$.username.required.$message = "Username already exist";
            }
            console.log("Username is available")
          })
          .catch(error => {
            console.log(error)
          })

    },
    checkIfEmailExist(){
      axios.post(this.host + '/user/check', {
        email: this.email
      })
          .then(response => {
            if (response.data){
              console.log("Email already exist")
              this.v$.email.$error = true;
              this.v$.email.email.$message = "Email already exist";
            }
            console.log("Email is available")
          })
          .catch(error => {
            console.log(error)
          })

    },
    submitForm() {
      //todo Update Form not Post
      axios.post(this.host + '/auth/register', {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        username: this.username,
        password: this.password.newPassword,
      })
          .then((response) =>  {

            if (response.status === 201) {
              console.log("User created");
              console.log(response.data.message);
              this.$router.push('/');
            }

          })
          .catch((error) => {
            console.log(error.response.data);
            console.log(error.response.data.relatedColumn);
            console.log(error.response.data.message);
          });
    }
  },


}
</script>

<style lang="scss" scoped>

</style>