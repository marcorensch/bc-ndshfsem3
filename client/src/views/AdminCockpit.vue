<template>
  <main class="adminCockpitOverview-page">
    <h3>Admin Cockpit</h3>
    <div>
      <h4>Users</h4>
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>{{ user.username }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button :disabled="!user.removable" class="delete-btn-icon" @click="handleDeleteUser(user.id)"><font-awesome-icon icon="trash" /></button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "AdminCockpitOverview",
  components: {FontAwesomeIcon},
  inject: ["host"],
  data() {
    return {
      users: []
    }
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      axios.get(`${this.host}/users`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          RefreshToken: localStorage.getItem('refreshToken')
        }
      })
          .then(response => {
            console.log(response.data);
            this.users = response.data.payload.users;
            this.users.map(user => {
              user.removable = user.id !==  response.data.payload.user_id;
            })
            if(response.data.payload.token) {
              console.log('token refreshed');
              localStorage.setItem('token', response.data.payload.token);
            }
          })
          .catch(error => {
            console.log(error);
          })
    },
    handleDeleteUser(id) {
      let selection = confirm("Are you sure you want to delete this user?");
      if (selection) {
        axios.delete(`${this.host}/users/${id}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
            .then(() => {
              this.users = this.users.filter(user => user.id !== id)
            })
            .catch(err => {
              console.log(err)
            })
      }
    }
  },
}
</script>

<style scoped>
*{
  transition: all 0.3s ease;
}
.delete-btn-icon:hover {
  color: #700000;
}

</style>