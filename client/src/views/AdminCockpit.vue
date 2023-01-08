<template>
  <main class="adminCockpitOverview-page">
    <h3>Admin Cockpit</h3>

    <ul class="nav nav-tabs mt-5" id="adminTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="users-tab" data-bs-toggle="tab" data-bs-target="#users" type="button" role="tab" aria-controls="home" aria-selected="true">
          <font-awesome-icon icon="users" /> Users
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="categories-tab" data-bs-toggle="tab" data-bs-target="#categories" type="button" role="tab" aria-controls="profile" aria-selected="false">
          <font-awesome-icon icon="boxes" /> Categories
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="tags-tab" data-bs-toggle="tab" data-bs-target="#tags" type="button" role="tab" aria-controls="contact" aria-selected="false">
          <font-awesome-icon icon="tags" /> Tags
        </button>
      </li>
    </ul>

    <div class="tab-content mt-3" id="adminTabContent">
      <div class="tab-pane fade show active" id="users" role="tabpanel" aria-labelledby="users-tab">
        <AdminUsersList />
      </div>
      <div class="tab-pane fade" id="categories" role="tabpanel" aria-labelledby="categories-tab">
        <AdminCategoriesList />
      </div>
      <div class="tab-pane fade" id="tags" role="tabpanel" aria-labelledby="tags-tab">
        <AdminTagsList />
      </div>
    </div>

  </main>
</template>

<script>
import AdminUsersList from "@/components/AdminUsersList.vue";
import AdminCategoriesList from "@/components/AdminCategoriesList.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import AdminTagsList from "@/components/AdminTagsList.vue";

export default {
  name: "AdminCockpitOverview",
  components: {AdminTagsList, FontAwesomeIcon, AdminUsersList, AdminCategoriesList},
  inject: ["host"],
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  },
}
</script>

<style>
* {
  transition: all 0.3s ease;
}
</style>