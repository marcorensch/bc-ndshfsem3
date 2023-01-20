<template>
  <div class="">
    <form class="editForm" ref="editForm" @submit.prevent="handleEditSubmit" autocomplete="off">
      <!-- Trick the browser into NOT auto-filling the form -->
      <input type="text" style="display:none">
      <input type="password" style="display:none">

      <div class="row">
        <div class="col-md-6">
          <label for="firstname">Firstname</label>
          <input type="text" class="form-control" id="firstname" v-model="user.firstname">
          <span v-if="v$.user.firstname.$error" :class="`${v$.user.firstname.$error ? 'error-message' : ''}`">
            {{ v$.user.firstname.required.$message }}
          </span>
        </div>
        <div class="col-md-6">
          <label for="lastname">Lastname</label>
          <input type="text" class="form-control" id="lastname" v-model="user.lastname">
          <span v-if="v$.user.lastname.$error" :class="`${v$.user.lastname.$error ? 'error-message' : ''}`">
            {{ v$.user.lastname.required.$message }}
          </span>
        </div>
        <div class="col-md-6">
          <label for="username">Username</label>
          <input type="text" class="form-control" id="username" v-model="user.username">
          <span v-if="v$.user.username.$error" :class="`${v$.user.username.$error ? 'error-message' : ''}`">
            {{ v$.user.username.required.$message }}
          </span>
        </div>
        <div class="col-md-6">
          <label for="email">E-Mail</label>
          <input type="text" class="form-control" id="email" v-model="user.email">
          <span v-if="v$.user.email.$error" :class="`${v$.user.email.$error ? 'error-message' : ''}`">
            {{ v$.user.email.email.$message }}
          </span>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-md-12">
          <span>Change your Password or leave empty if you don't want to change it</span>
        </div>
        <div class="col-md-6">
          <label for="new-password">New password</label>
          <input type="password" class="form-control" id="new-password" v-model="password" autocomplete="off">
          <span v-if="v$.password.$error" :class="`${v$.password.$error ? 'error-message' : ''}`">
            {{ "Min. " + v$.password.minLength.$params.min + " characters" }}
          </span>
        </div>
        <div v-if="password.length || passwordConfirmation.length" class="col-md-6">
          <label for="confirm-password">Confirm password</label>
          <input type="password" class="form-control" id="confirm-password" v-model="passwordConfirmation">
          <span v-if="v$.passwordConfirmation.$error" :class="`${v$.passwordConfirmation.$error ? 'error-message' : ''}`">
            {{ "Not same password" }}
          </span>
        </div>
      </div>
      <div class="mt-5 row justify-content-md-end">
        <div class="col-auto">
          <button type="submit" class="btn btn-success"><font-awesome-icon icon="save" />Submit</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import {useVuelidate} from "@vuelidate/core";
import {required, minLength, sameAs, email, requiredIf} from "@vuelidate/validators";
import {useToast} from "vue-toastification";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import axios from "axios";
import {useUserStore} from "@/stores/UserStore";

export default {
  name: "UserAccountEditForm",
  components: {FontAwesomeIcon},
  inject: ['host'],
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {v$: useVuelidate()}
  },
  data() {
    return {
      password: '',
      passwordConfirmation: '',
      toast: useToast(),
      userStore: useUserStore(),
      origUserData: {...this.user}
    }
  },
  validations() {
    return {
      user: {
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
        }
      },
      password: {
        required: requiredIf(() => this.password.length > 0 || this.passwordConfirmation.length > 0),
        minLength: minLength(8),
      },
      passwordConfirmation: {
        sameAs: sameAs(this.password)
      }
    }
  },
  methods: {
    async handleEditSubmit() {
      const valid = await this.v$.$validate();
      if(!valid){
        this.toast.error('Not saved! Please fill out all fields correctly');
        return;
      }
      if(this.checkIfEqualValues(this.user, this.origUserData) && this.password.length === 0){
        this.toast.warning('No changes made');
        return;
      }
      this.submitUpdate();
    },
    checkIfEqualValues(obj1, obj2) {
      return JSON.stringify(obj1) === JSON.stringify(obj2);
    },
    submitUpdate(){
      axios.put(this.host + '/users/me', {
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        email: this.user.email,
        username: this.user.username,
        password: this.password
      },{
        headers: this.userStore.getReqHeaders
      })
        .then(response => {
          this.toast.success('Successfully updated your account');
          if(response.data.payload.token){
            this.userStore.setToken(response.data.payload.token);
          }
        })
        .catch(error => {
          this.toast.error('Error updating your account');
          console.error(error);
        });
    }
  }
}
</script>