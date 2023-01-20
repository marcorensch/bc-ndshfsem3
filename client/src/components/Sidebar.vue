<template>
  <aside :class="`${is_expanded ? 'is-expand' : ''}`">
    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="toggleMenu">
        <span class="icon-angles"><font-awesome-icon icon="angles-right"/></span>
      </button>
    </div>
    <div class="menu">
      <ul>
        <li>
          <router-link class="button" :to="{name: 'Home'}">
            <span class="menu-icons"><font-awesome-icon icon="house"/></span>
            <span class="title">Home</span>
          </router-link>
        </li>
        <li v-if="userStore.isLoggedIn">
          <router-link  class="button" :to="{name: 'Question New'}">
            <span class="menu-icons"><font-awesome-icon icon="comment"/></span>
            <span class="title">Ask</span>
          </router-link>
        </li>
        <li v-for="category in favCatsStore.getFavs">
          <router-link class="button" :to="{ name: 'Category Questions', params: { id : category.id }}">
            <span class="menu-icons"><font-awesome-icon icon="boxes"/></span>
            <span class="title">{{category.title}}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="flex"></div>
    <div class="menu">
      <ul v-if="!userStore.isLoggedIn">
      <li>
        <a href="#" id="show-login-modal" @click="showLoginModal=true" class="button">
          <span class="menu-icons"><font-awesome-icon icon="user"/></span>
          <span class="title">Login</span>
        </a>
      </li>
      <li>
        <router-link class="button" :to="{name: 'Registration'}">
          <span class="menu-icons"><font-awesome-icon icon="user-plus"/></span>
          <span class="title">Signup</span>
        </router-link>
      </li>
      </ul>
    </div>
    <div class="menu" v-if="userStore.isLoggedIn">
      <router-link class="button" :to="{name: 'User Cockpit'}">
        <span class="menu-icons"><font-awesome-icon icon="key"/></span>
        <span class="title">User Settings</span>
      </router-link>
    </div>
    <div class="menu" v-if="userStore.isLoggedIn && userStore.isAdmin">
      <router-link class="button" :to="{name: 'Administration'}">
        <span class="menu-icons"><font-awesome-icon icon="cogs"/></span>
        <span class="title">Admin Settings</span>
      </router-link>
    </div>
    <div class="menu" v-if="userStore.isLoggedIn">
      <a href="#" class="button" @click="handleLogoutClicked">
        <span class="menu-icons"><font-awesome-icon icon="right-from-bracket"/></span>
        <span class="title">Logout</span>
      </a>
    </div>
  </aside>
  <Teleport to="body">
    <LoginModal :show="showLoginModal" @close="handleModalClose">
    </LoginModal>
  </Teleport>
</template>

<script>

import LoginModal from "@/components/LoginModal";
import axios from "axios";
import { useUserStore } from "@/stores/UserStore";
import { useFavCatsStore } from "@/stores/FavCategoriesStore";

export default {
  name: 'Sidebar',
  inject: ['host'],
  components: {
    LoginModal
  },
  data() {
    return {
      is_expanded: localStorage.getItem('is_expanded') === 'true',
      showLoginModal: false,
      userStore: useUserStore(),
      user: null,
      favCatsStore: useFavCatsStore(),
    }
  },
  mounted() {
    this.getFavoriteCategories()
  },
  methods: {
    getFavoriteCategories() {
      axios.get(this.host + '/categories',{
        params: {
          onlyFavorites: true
        }
      }).then(response => {
        this.favCatsStore.setFavs(response.data)
      })
    },
    handleModalClose(){
      this.showLoginModal = false
    },
    toggleMenu() {
      this.is_expanded = !this.is_expanded
      localStorage.setItem('is_expanded', this.is_expanded)
    },
    handleLogoutClicked(){
      const {refreshToken} = this.userStore.getTokens;
      this.userStore.logout();
      axios.delete(this.host + "/auth/logout", {
        headers:{
          Authorization: `Bearer ${refreshToken}`
        }
      }).then((response) => {
        if(!response.data.success){
          console.log(response.data)
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.$router.push({name: 'Home'})
      });
    },
  }
}
</script>

<style lang="scss" scoped>

</style>