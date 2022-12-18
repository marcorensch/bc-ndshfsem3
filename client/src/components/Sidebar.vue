<template>
  <aside :class="`${is_expanded ? 'is-expand' : ''}`">
    <div class="logo">
      <img src="../assets/logo.png" alt="logo">
    </div>
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
        <li>
          <router-link id="show-modal" @click="showLoginModal = true" class="button" to="/login">
            <span class="menu-icons">
              <font-awesome-icon icon="user"/> </span>
            <span class="title">Login</span>
          </router-link>
        </li>
        <li>
          <router-link class="button" to="/register">
            <span class="menu-icons"><font-awesome-icon icon="user-plus"/></span>
            <span class="title">Signup</span>
          </router-link>
        </li>
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
      </ul>
    </div>
    <div class="flex"></div>
    <div class="menu">
      <router-link class="button" to="/admin">
        <span class="menu-icons"><font-awesome-icon icon="key"/></span>
        <span class="title">Admin</span>
      </router-link>
    </div>

  </aside>
  <Teleport to="body">
    <LoginModal :show="showLoginModal" @close="showLoginModal = false">
    </LoginModal>
  </Teleport>
</template>

<script>

import LoginModal from "@/components/LoginModal";

export default {
  name: 'Sidebar',
  components: {
    LoginModal
  },


  data() {
    return {
      is_expanded: localStorage.getItem('is_expanded') === 'true',
      showLoginModal: false,
    }
  },

  methods: {
    toggleMenu() {
      this.is_expanded = !this.is_expanded
      localStorage.setItem('is_expanded', this.is_expanded)
      console.log(this.is_expanded)
    }
  }

}
</script>

<style lang="scss" scoped>
aside {
  display: flex;
  flex-direction: column;
  width: calc(2rem + 32px);
  min-height: 100vh;
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
      top: -3rem;

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