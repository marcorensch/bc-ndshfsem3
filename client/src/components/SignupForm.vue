<template>
  <form ref="form" @submit.prevent="handleSubmit" class="form-horizontal container-fluid">
    <h3>Signup form</h3>
    <div class="form-wrapper">
      <div class="form-group w-75 p-3">
        <label for="firstname" class="col-form-label col-md-10">Firstname:</label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="firstname" v-model="firstname"/>
          <span v-if="v$.firstname.$error"
                :class="`${v$.firstname.$error ? 'error-message' : ''}`">{{ v$.firstname.required.$message }}</span>
        </div>
      </div>
      <div class="form-group w-75 p-3">
        <label for="lastname" class="col-form-label col-md-10">Lastname:</label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="lastname" v-model="lastname"/>
          <span v-if="v$.lastname.$error"
                :class="`${v$.lastname.$error ? 'error-message' : ''}`">{{ v$.lastname.required.$message }}</span>
        </div>
      </div>
      <div class="form-group w-75 p-3">
        <label for="email" class="col-form-label col-md-10">Email:</label>
        <div class="col-md-12">
          <input type="email" class="form-control" id="email" v-model="email" @blur="checkIfEmailExist"/>
          <span v-if="v$.email.$error"
                :class="`${v$.email.$error ? 'error-message' : ''}`">{{ v$.email.email.$message }}</span>
        </div>
      </div>
      <div class="form-group w-75 p-3">
        <label for="username" class="col-form-label col-md-10">Username:</label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="username" v-model="username" @blur="checkIfUsernameExist"/>
          <span v-if="v$.username.$error"
                :class="`${v$.username.$error ? 'error-message' : ''}`">{{ v$.username.required.$message }}</span>
        </div>
      </div>
      <div class="form-group w-75 p-3">
        <label for="new-password" class="col-form-label col-md-10">New password:</label>
        <div class="col-md-12">
          <input type="password" class="form-control" id="new-password" v-model="password.newPassword"/>
          <span v-if="v$.password.newPassword.$error"
                :class="`${v$.password.newPassword.$error ? 'error-message' : ''}`">{{ "Min. " + v$.password.newPassword.minLength.$params.min + " characters" }}</span>
        </div>

      </div>
      <div class="form-group w-75 p-3">
        <label for="confirm-password" class="col-form-label col-md-10">Confirm password:</label>
        <div class="col-md-12">
          <input type="password" class="form-control" id="confirm-password" v-model="password.confirmPassword"/>
          <span v-if="v$.password.confirmPassword.$error"
                :class="`${v$.password.confirmPassword.$error ? 'error-message' : ''}`">{{ "Not same password" }}</span>
        </div>
      </div>
      <div class="form-group w-75 p-3">
        <div class="col-md-12">
          <button type="submit" class="btn ">Sign Up</button>
        </div>
      </div>
    </div>
  </form>
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

  name: "SignupForm",
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
      submitConfirmText: "Thank you for signing up!",

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
      try {
        const valid = await this.v$.$validate();
        console.log("result=" + valid);
        if (valid) {
          console.log("Form is valid => Submitted");
          // Submit form
         this.submitForm();

          this.$refs.form.reset();
          //todo show message if success

        } else {
          console.log('Form is invalid')
        }
        console.log(this.firstname, this.lastname, this.email, this.password.newPassword, this.password.confirmPassword)

      } catch (e) {
        console.log(e)
      }

    },
    async checkIfUsernameExist() {
      let response;
      try {
        response = await axios.post(this.host + '/user/check', {
          username: this.username
        })

      } catch (error) {
        console.log(error)
      }
      //TODO Route für Username check erstellen + message entgegennehmen und darstellen
      console.log(response);

    },
    async checkIfEmailExist(){
      let response;
      try {
        response = await axios.post(this.host + '/user/check', {
          email: this.email
        })

      } catch (error) {
        console.log(error)
      }
      //TODO Route für Email check erstellen + message entgegennehmen und darstellen
      console.log(response);
    },
     submitForm() {
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

.form-horizontal {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);


}

.form-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 3px solid #f1f1f1;
}

.form-group {
  margin: 0 auto;
}

.btn {
  font-size: 1.5rem;
  background-color: var(--dark);
  border-radius: 2px;
  color: (var(--light));
  padding: 14px 20px;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: 0.2s ease-out;

  &:hover {
    background-color: var(--primary);
  }
}

label {
  font-weight: bold;
}

input[type=text], input[type=password], input[type=email] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
  border-radius: 2px;

  &:focus {
    border: 1px solid var(--primary);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  }
}

.error-message {
  color: red;
  font-size: 0.8rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .form-horizontal {
    max-width: 100%;
  }


  .btn {
    width: 100%;
    font-size: 1rem
  }
}
</style>