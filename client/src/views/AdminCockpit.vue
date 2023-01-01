<template>
  <main class="adminCockpitOverview-page">
    <h3>Admin Cockpit</h3>
    <div>
      <h4>Users</h4>
      <div class="table-responsive nxd-max-height-large">
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
          <tr v-for="user in users" :key="user.id">
            <td data-toggle="tooltip" data-placement="top" title="User ID">{{ user.id }}</td>
            <td data-toggle="tooltip" data-placement="top" title="Username">{{ user.username }}</td>
            <td data-toggle="tooltip" data-placement="top" title="Firstname">{{ user.firstname }}</td>
            <td data-toggle="tooltip" data-placement="top" title="Lastname">{{ user.lastname }}</td>
            <td data-toggle="tooltip" data-placement="top" title="Role">{{ user.roletitle }}</td>
            <td data-toggle="tooltip" data-placement="top" title="Registered">{{ user.registeredString }}</td>
            <td>
              <button data-toggle="tooltip" data-placement="top" :title="'Delete ' + user.username" :disabled="!user.removable" class="delete-btn-icon" @click="handleDeleteUser(user.id)"><font-awesome-icon icon="trash" /></button>
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
              user.registeredString = new Date(user.created_at).toLocaleDateString() +" "+ new Date(user.created_at).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})
            })
            if(response.data.payload.token) {
              console.log('token refreshed');
              localStorage.setItem('token', response.data.payload.token);
            }
          })
          .catch(error => {
            console.log(error);
            localStorage.removeItem('isAdmin')
            this.$router.push({name: 'Home'});
          })
    },
    handleDeleteUser(id) {
      let selection = confirm("Are you sure you want to delete this user?");
      if (selection) {
        axios.delete(`${this.host}/users/${id}`, {
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
.nxd-max-height-large {
  max-height: 400px;
  overflow-y: auto;
}
.delete-btn-icon:hover {
  color: #700000;
}

</style>