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
          <router-link class="button" to="/">
            <span class="menu-icons"><font-awesome-icon icon="house"/></span>
            <span class="title">Home</span>
          </router-link>
        </li>
        <li v-if="userStore.isLoggedIn">
          <router-link  class="button" to="/question/new">
            <span class="menu-icons">
              <font-awesome-icon icon="comment"/> </span>
            <span class="title">Ask</span>
          </router-link>
        </li>
        <template v-if="!userStore.isLoggedIn">
          <li>
            <a href="#" id="show-login-modal" @click="showLoginModal=true" class="button">
            <span class="menu-icons">
              <font-awesome-icon icon="user"/> </span>
              <span class="title">Login</span>
            </a>
          </li>
          <li>
            <router-link class="button" to="/register">
              <span class="menu-icons"><font-awesome-icon icon="user-plus"/></span>
              <span class="title">Signup</span>
            </router-link>
          </li>
        </template>

        <li>
          <router-link class="button" to="/categorie1">
            <span class="menu-icons"><font-awesome-icon icon="crown"/></span>
            <span class="title">Category 1</span>
          </router-link>
        </li>
        <li>
          <router-link class="button" to="/categorie2">
            <span class="menu-icons"><font-awesome-icon icon="crown"/></span>
            <span class="title">Category 2</span>
          </router-link>
        </li>
<!-- Test Views -->
        <router-link to="user/cockpit/overview"></router-link>
      </ul>
    </div>
    <div class="flex"></div>
    <div class="menu" v-if="userStore.isLoggedIn">
      <router-link class="button" to="/user/cockpit/overview">
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
    <LoginModal :show="showLoginModal" @close="handleModalClose" @loggedIn="loggedIn">
    </LoginModal>
  </Teleport>
</template>

<script>

import LoginModal from "@/components/LoginModal";
import axios from "axios";
import { useUserStore } from "@/stores/UserStore";

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
    }
  },
  mounted() {

  },
  methods: {
    handleModalClose(){
      this.showLoginModal = false
    },
    toggleMenu() {
      this.is_expanded = !this.is_expanded
      localStorage.setItem('is_expanded', this.is_expanded)
    },
    handleLogoutClicked(){
      const {token, refreshToken} = this.userStore.getTokens;
      this.userStore.logout();

      axios.delete(this.host + "/auth/logout", {
        headers:{
          Authorization: `Bearer ${refreshToken}`
        }
      }).then((response) => {
        if(response.data.success){

        }else{
          console.log(response.data)
        }
      }).catch((error) => {
        this.errorMessage = error.response.data.message
      }).finally(()=>{
        this.$router.push('/')
      });
    },
    loggedIn(){
    }
  }

}
</script>

<style lang="scss" scoped>
aside {
  display: flex;
  flex-direction: column;
  width: calc(2rem + 32px);
  min-height: calc(100vh - 88px);
  overflow: hidden;
  padding: 1rem;

  background-color: var(--dark);
  color: var(--light);

  transition: 0.2s ease-out;

  .flex {
    flex: 1 1 0;
  }

  .logo {
    margin-bottom: 1rem;

    img {
      width: 2rem;
    }
  }

  .menu-toggle-wrap {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;

    position: relative;
    top: 0;
    transition: 0.2s ease-out;


    .menu-toggle {
      transition: 0.2s ease-out;

      .icon-angles {
        font-size: 2rem;
        color: var(--light);
        transition: 0.2s ease-out;
      }

      &:hover {
        .icon-angles {
          color: var(--primary);
          /* transform funktion niert nicht*/
          transform: translateX(0.5rem);
        }
      }
    }
  }

  .button .title {
    opacity: 0;
    transition: 0.3s ease-out;
  }

  .menu {
    margin: 0 -1rem;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .button {
      display: flex;
      align-items: center;
      text-decoration: none;

      padding: 0.5rem 1rem;
      transition: 0.2s ease-out;

      .menu-icons {
        font-size: 2rem;
        color: var(--light);
        transition: 0.2s ease-out;
        width: 2.5rem;


      }

      .title {
        color: var(--light);
        transition: 0.2s ease-out;
      }

      &:hover, &.router-link-exact-active {
        background-color: var(--dark-alt);
        border-right: 5px solid var(--primary);

        .menu-icons, .title {
          color: var(--primary);
        }

      }

    }
  }

  &.is-expand {
    width: var(--sidebar-width);

    .menu-toggle-wrap {
      top: 0;

      .menu-toggle {
        transform: rotate(-180deg);
      }
    }

    .button .title {
      opacity: 1;
    }

    .button {
      .menu-icons {
        margin-right: 1rem;
      }
    }
  }

  @media (max-width: 768px) {
    position: fixed;
    z-index: 99;

  }
}
</style>