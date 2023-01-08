<template>
  <div>
    <div class="mt-5">
      <input class="w-100 form-control" type="text" id="search_user" placeholder="Search for Username, Name, Firstname" @keyup="filterUserList" />
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Firstname</th>
          <th>Lastname</th>
          <th>Role</th>
          <th>Registered</th>
          <th>Actions</th>
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

export default {
  name: "UsersList",
  inject: ["host"],
  data() {
    return {
      users: [],
      headers: null,
      userStore: useUserStore(),
    };
  },
  mounted() {
    this.headers = {
      Authorization: `Bearer ${this.userStore.getTokens.token}`,
      RefreshToken: `${this.userStore.getTokens.refreshToken}`
    };
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
            if (user.username.toLowerCase().includes(search.toLowerCase()) || user.firstname.toLowerCase().includes(search.toLowerCase()) || user.lastname.toLowerCase().includes(search.toLowerCase())) {
              user.visible = true;
            } else {
              user.visible = false;
            }
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
        headers: {
          Authorization: `Bearer ${this.userStore.getTokens.token}`,
          RefreshToken: `${this.userStore.getTokens.refreshToken}`
        }
      })
          .then(response => {
            console.log(response.data);
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
              console.log('token refreshed');
              this.userStore.setToken(response.data.payload.token);
            }
          })
          .catch(error => {
            console.log(error);
            // this.$router.push({name: 'Home'});
          })
    },
    handleDeleteUser(id) {
      let selection = confirm("Are you sure you want to delete this user?");
      if (selection) {
        axios.delete(`${this.host}/users/${id}`, {
          headers: this.headers
        })
            .then(() => {
              this.users = this.users.filter(user => user.id !== id)
            })
            .catch(err => {
              console.log(err)
            })
      }
    },
  },
}
</script>

<style scoped>

.hidden{
  display: none;
}

</style>