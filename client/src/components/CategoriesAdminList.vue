<template>
  <div>
    <form>
      <div class="form-group">
        <div class="row">
          <div class="col">
            <input type="text" class="form-control" id="new_cat_title" placeholder="Enter new Category Title">
          </div>
          <div class="col-md-auto">
            <button class="btn btn-primary" @click="handleAddCategory">Add Category</button>
          </div>
        </div>
      </div>
    </form>
    <div class="mt-3 table-responsive">
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>ID</th>
          <th>Favorite</th>
          <th class="col-md-10">Title</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="category in categories" :key="category.id" :data-cat-id="category.id">
          <td data-toggle="tooltip" data-placement="top" title="Category ID" class="align-middle">{{ category.id }}</td>
          <td data-toggle="tooltip" data-placement="top" title="is Favorite" class="text-center align-middle" @click="handleIsFavToggleClicked">
            <font-awesome-icon icon="star" class="favorite-icon" :class="{isFav : category.fav}"/>
          </td>
          <td data-toggle="tooltip" data-placement="top" title="Title" class="align-middle">
              <span :id="'category-'+category.id+'-title'" :data-cat-id="category.id" :data-cat-title="category.title" @click="handleEditCategory" v-if="!category.edit">{{
                  category.title
                }}</span>
            <div v-else :data-cat-id="category.id">
              <div class="row">
                <div class="col">
                  <input type="text" class="form-control" :id="'cat_title_' + category.id" :value="category.title">
                </div>
                <div class="col-md-auto">
                  <div class="btn-group" role="group" aria-label="Category Title Actions">
                    <button title="Cancel Changes" type="button" class="btn btn-warning"
                            @click="handleUnsetEditClicked">
                      <font-awesome-icon icon="times"/>
                    </button>
                    <button title="Save Changes" type="button" class="btn btn-success"
                            @click="handleCategoryTitleUpdate">
                      <font-awesome-icon icon="save"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td class="align-middle">
            <div class="row">
              <div class="col-md-auto">
                <button data-toggle="tooltip" data-placement="top" :title="'Delete ' + category.title"
                        class="delete-btn-icon"
                        @click="handleDeleteCategoryClicked">
                  <font-awesome-icon icon="trash"/>
                </button>
              </div>
              <div class="col-md-auto">
                <button :title="'Edit ' + category.title + ' Category'"
                        class="edit-btn-icon"
                        @click="handleEditCategory"
                >
                  <font-awesome-icon icon="pencil" @click="handleEditCategory"/>
                </button>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {useUserStore} from "@/stores/UserStore";
import axios from "axios";

export default {
  name: "CategoriesAdminList",
  inject: ["host"],
  data() {
    return {
      categories: [],
      headers: null,
      userStore: useUserStore(),
    };
  },
  mounted() {
    this.headers = {
      Authorization: `Bearer ${this.userStore.getTokens.token}`,
      RefreshToken: `${this.userStore.getTokens.refreshToken}`
    }
    this.getCategories();
    document.addEventListener("keyup", this.handleKeyUp);
  },
  methods: {
    handleKeyUp(e) {
      if (e.key === "Escape") {
        this.handleUnsetEditClicked();
      }
    },

    getCategories() {
      axios.get(`${this.host}/categories`, {})
          .then(response => {
            this.categories = response.data;
          })
          .catch(error => {
            console.log(error);
          })
    },
    checkIfCategoryExists(title, id) {
      return this.categories.some(category => {
        return category.id !== id && category.title === title;
      });
    },
    getCategoryIdFromTable(event) {
      return Number(event.target.closest('tr').dataset.catId);
    },
    handleEditCategory(event) {
      const catId = this.getCategoryIdFromTable(event);
      for (const categoryItem of this.categories) {
        categoryItem.edit = categoryItem.id === catId;
      }
    },
    handleIsFavToggleClicked(event) {
      const catId = this.getCategoryIdFromTable(event);
      const category = this.categories.find(category => {
        if(category.id === catId) return category;
      });
      category.fav = !category.fav;
      this.handleUpdateCategory(category)
    },
    handleCategoryTitleUpdate(event) {
      console.log("handleCategoryTitleUpdate");
      const catId = this.getCategoryIdFromTable(event);
      const newValue = document.getElementById('cat_title_' + catId).value;
      if (newValue === "") {
        alert("Category title cannot be empty!");
        return;
      }
      if(this.checkIfCategoryExists(newValue, catId)) {
        alert("Category already exists!");
        return;
      }

      const category = this.categories.find(category => {
        if(category.id === catId) return category;
      });

      if(category.title !== newValue) {
        category.title = newValue;
        this.handleUpdateCategory(category);
      }
    },
    handleAddCategory(e) {
      e.preventDefault();
      const inputField = document.getElementById('new_cat_title');
      let title = inputField.value;
      inputField.value = '';

      if (title === "") {
        alert("Category title cannot be empty!");
        return;
      }

      if(this.checkIfCategoryExists(title)) {
        alert("Category already exists!");
        return;
      }

      axios.post(`${this.host}/categories/create`, {
        title: title
      }, {
        headers: this.headers
      })
          .then(response => {
            this.getCategories();
          })
          .catch(err => {
            console.log(err)
          })
    },
    handleDeleteCategoryClicked(event) {
      const catId = this.getCategoryIdFromTable(event);
      const category = this.categories.find(category => {
        if(category.id === catId) return category;
      });
      this.handleDeleteCategory(category);
    },
    handleDeleteCategory(category) {
      let selection = confirm(`Are you sure you want to delete the category ${category.title}?`);
      if (selection) {
        axios.delete(`${this.host}/categories/${category.id}`, {
          headers: this.headers
        })
            .then(() => {
              this.categories = this.categories.filter(c => c.id !== category.id)
            })
            .catch(err => {
              console.log(err)
            })
      }
    },
    handleUpdateCategory(category) {
      axios.put(`${this.host}/categories/${category.id}`, {
        title: category.title,
        fav: category.fav
      }, {
        headers: this.headers
      }).then(() => {
        this.getCategories();
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
      });
    },
    handleUnsetEditClicked() {
      this.categories.forEach(category => {
        category.edit = false;
      });
    },
  }
}
</script>

<style scoped>
.delete-btn-icon:hover {
  color: #700000;
}

.favorite-icon {
  cursor: pointer;
  color: rgba(0, 0, 0, 0.1);
}
.favorite-icon:hover {
  color: rgba(0, 0, 0, 0.5);
}
.favorite-icon.isFav{
  color: gold;
}
</style>