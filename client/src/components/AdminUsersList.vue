<template>
  <div>
    <div class="">
      <input class="w-100 form-control" type="text" id="search_user" placeholder="Search for Username, Name, Firstname" @keyup="filterUserList" />
    </div>
    <div class="mt-3 table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th class="col-1">ID</th>
            <th class="col-1">Username</th>
            <th class="col-1">Firstname</th>
            <th class="col-1">Lastname</th>
            <th class="col-1">Role</th>
            <th class="col-1">Registered</th>
            <th class="col-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" :class="{hidden : !user.visible}">
            <td data-toggle="tooltip" data-placement="top" title="User ID">{{ user.id }}</td>
            <td data-toggle="tooltip" data-placement="top" title="Username">{{ user.username }}</td>
            <td data-toggle="tooltip" data-placement="top" title="Firstname">{{ user.firstname }}</td>
            <td data-toggle="tooltip" data-placement="top" title="Lastname">{{ user.lastname }}</td>
            <td data-toggle="tooltip" data-placement="top" title="Role">{{ user.roletitle }}</td>
            <td data-toggle="tooltip" data-placement="top" title="Registered">{{ user.registeredString }}</td>
            <td>
              <button data-toggle="tooltip" data-placement="top" :title="'Delete ' + user.username" :disabled="!user.removable" class="delete-btn-icon" @click="handleDeleteUser(user.id)">
                <font-awesome-icon icon="trash"/>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from "@/stores/UserStore";
import {useToast} from "vue-toastification";

export default {
  name: "AdminUsersList",
  inject: ["host"],
  data() {
    return {
      users: [],
      userStore: useUserStore(),
      toast: useToast(),
    };
  },
  mounted() {
    if(!this.userStore.user.isadministrator) return;
    this.getUsers();
  },
  methods:{
    debounce(func, timeout = 400){
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
      };
    },
    filterUserList(){
      const processChange = this.debounce(() => {
        const search = document.getElementById("search_user").value;
        if(search.length > 0) {
          for (const user of this.users) {
            user.visible = user.username.toLowerCase().includes(search.toLowerCase()) || user.firstname.toLowerCase().includes(search.toLowerCase()) || user.lastname.toLowerCase().includes(search.toLowerCase());
          }
        } else {
          for (const user of this.users) {
            user.visible = true;
          }
        }
      });
      processChange();
    },
    getUsers() {
      axios.get(`${this.host}/users`, {
        headers: this.userStore.getReqHeaders
      })
          .then(response => {
            this.users = response.data.payload.users;
            this.users.map(user => {
              user.visible = true;
              user.removable = user.id !== response.data.payload.user_id;
              user.registeredString = new Date(user.created_at).toLocaleDateString() + " " + new Date(user.created_at).toLocaleTimeString(navigator.language, {
                hour: '2-digit',
                minute: '2-digit'
              })
            })
            if (response.data.payload.token) {
              this.userStore.setToken(response.data.payload.token);
            }
          })
          .catch(err => {
            this.toast.error("Error while fetching users");
            console.log(err);
          })
    },
    handleDeleteUser(id) {
      let selection = confirm("Are you sure you want to delete this user?");
      if (selection) {
        axios.delete(`${this.host}/users/${id}`, {
          headers: this.userStore.getReqHeaders
        })
            .then(() => {
              this.toast.success("User deleted");
              this.users = this.users.filter(user => user.id !== id)
            })
            .catch(err => {
              this.toast.error("Error while deleting user");
              console.log(err)
            })
      }
    },
  },
}
</script>

<style scoped>

</style>