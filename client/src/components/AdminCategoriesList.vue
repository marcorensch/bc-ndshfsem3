<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h4>Add Category</h4>
        <div class="form-group">
          <div class="row g-0">
            <div class="col">
              <input type="text" class="form-control" id="new_cat_title" placeholder="Enter new Category Title" @keyup="handleAddCategoryByEnter">
            </div>
            <div class="col-auto align-self-center">
              <button class="btn btn-primary btn-large" @click="handleAddCategory">Add Category</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <input type="text" id="search_category" class="form-control w-100" placeholder="Search for Category Title" @keyup="filterCategoryList">
    </div>
    <div class="mt-3 table-responsive">
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th class="sortable col-1" @click="handleSortById"><font-awesome-icon icon="sort" /> ID</th>
          <th class="sortable col-2" @click="handleSortByFav"><font-awesome-icon icon="sort" /> Favorite</th>
          <th class="sortable col-sm-8" @click="handleSortByTitle"><font-awesome-icon icon="sort" /> Title</th>
          <th class="col-3 text-center">Actions</th>
        </tr>
        </thead>
        <tbody>
        <template v-if="categories.length > 0">
          <tr v-for="category in categories" :key="category.id" :data-cat-id="category.id" :class="{hidden:!category.visible}">
            <td data-toggle="tooltip" data-placement="top" title="Category ID" class="align-middle">{{ category.id }}</td>
            <td data-toggle="tooltip" data-placement="top" title="is Favorite" class="align-middle"
                @click="handleIsFavToggleClicked">
              <font-awesome-icon icon="star" class="favorite-icon" :class="{isFav : category.fav}"/>
            </td>
            <td data-toggle="tooltip" data-placement="top" title="Title" class="align-middle">
              <span class="editable-title" :id="'category-'+category.id+'-title'" :data-cat-id="category.id" :data-cat-title="category.title" @click="handleEditCategory" v-if="!category.edit">
                {{ category.title }}
              </span>
              <div v-else :data-cat-id="category.id">
                <div class="row">
                  <div class="col">
                    <input type="text" class="form-control" :id="'cat_title_' + category.id" :value="category.title">
                  </div>
                  <div class="col-auto align-self-center">
                    <div class="btn-group" role="group" aria-label="Category Title Actions">
                      <button title="Cancel Changes" type="button" class="btn btn-warning" @click="handleUnsetEditClicked">
                        <font-awesome-icon icon="times"/>
                      </button>
                      <button title="Save Changes" type="button" class="btn btn-success" @click="handleCategoryTitleUpdate">
                        <font-awesome-icon icon="save"/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td class="align-middle text-center">
              <div class="row gx-0">
                <div class="col-6">
                  <button data-toggle="tooltip" data-placement="top" :title="'Delete ' + category.title" class="action-button delete-btn-icon" @click="handleDeleteCategoryClicked">
                    <font-awesome-icon icon="trash"/>
                  </button>
                </div>
                <div class="col-6">
                  <button :title="'Edit ' + category.title + ' Category'" class="action-button edit-btn-icon" @click="handleEditCategory">
                    <font-awesome-icon icon="pencil" @click="handleEditCategory"/>
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {useUserStore} from "@/stores/UserStore";
import {useFavCatsStore} from "@/stores/FavCategoriesStore";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useToast} from "vue-toastification";

export default {
  name: "AdminCategoriesList",
  components: {FontAwesomeIcon},
  inject: ["host"],
  data() {
    return {
      categories: [],
      userStore: useUserStore(),
      favCatsStore: useFavCatsStore(),
      toast: useToast(),
    };
  },
  mounted() {
    this.getCategories();
    document.addEventListener("keyup", this.handleKeyUp);
  },
  methods: {
    debounce(func, timeout = 400){
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
      };
    },
    filterCategoryList(){
      const processChange = this.debounce(() => {
        const search = document.getElementById("search_category").value;
        if(search.length > 0) {
          for (const cat of this.categories) {
            cat.visible = cat.title.toLowerCase().includes(search.toLowerCase());
          }
        } else {
          for (const cat of this.categories) {
            cat.visible = true;
          }
        }
      });
      processChange();
    },
    handleSortByFav() {
      this.categories.sort((a, b) => {
        if (a.fav === b.fav) {
          return 0;
        }
        if (a.fav) {
          return -1;
        }
        return 1;
      });
    },
    handleSortByTitle() {
      this.categories.sort((a, b) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) {
          return -1;
        }
        if (a.title.toLowerCase() > b.title.toLowerCase()) {
          return 1;
        }
        return 0;
      });
    },
    handleSortById() {
      this.categories.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
        return 0;
      });
    },
    handleAddCategoryByEnter(e) {
      if (e.key === "Enter") {
        this.handleAddCategory(e);
      }
    },
    handleKeyUp(e) {
      if (e.key === "Escape") {
        this.handleUnsetEditClicked();
      }
    },

    getCategories() {
      axios.get(`${this.host}/categories`, {})
          .then(response => {
            this.categories = response.data.map(cat => {
              cat.visible = true;
              return cat;
            });
          })
          .catch(err => {
            console.log(err);
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
        if (category.id === catId) return category;
      });
      category.fav = !category.fav;
      this.favCatsStore.setFavs(this.categories.filter(category => category.fav));
      this.handleUpdateCategory(category)
    },
    handleCategoryTitleUpdate(event) {
      const catId = this.getCategoryIdFromTable(event);
      const newValue = document.getElementById('cat_title_' + catId).value;
      if (newValue === "") {
        this.toast.warning("Category title cannot be empty!");
        return;
      }
      if (this.checkIfCategoryExists(newValue, catId)) {
        this.toast.error("Category already exists!");
        return;
      }
      const category = this.categories.find(category => {
        if (category.id === catId) return category;
      });
      if (category.title !== newValue) {
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
        this.toast.warning("Category title cannot be empty!");
        return;
      }
      if (this.checkIfCategoryExists(title)) {
        this.toast.error("Category already exists!");
        return;
      }

      axios.post(`${this.host}/categories/create`, {
        title: title
      }, {
        headers: this.userStore.getReqHeaders
      })
          .then(response => {
            this.toast.success("Category added!");
            this.getCategories();
          })
          .catch(err => {
            console.log(err)
          })
    },
    handleDeleteCategoryClicked(event) {
      const catId = this.getCategoryIdFromTable(event);
      const category = this.categories.find(category => {
        if (category.id === catId) return category;
      });
      this.handleDeleteCategory(category);
    },
    handleDeleteCategory(category) {
      let selection = confirm(`Are you sure you want to delete the category ${category.title}?`);
      if (selection) {
        axios.delete(`${this.host}/categories/${category.id}`, {
          headers: this.userStore.getReqHeaders
        })
            .then(() => {
              this.toast.success("Category deleted!");
              this.categories = this.categories.filter(c => c.id !== category.id)
            })
            .catch(err => {
              this.toast.error("Something went wrong!");
              console.log(err)
            })
      }
    },
    handleUpdateCategory(category) {
      axios.put(`${this.host}/categories/${category.id}`, {
        title: category.title,
        fav: category.fav
      }, {
        headers: this.userStore.getReqHeaders
      }).then(() => {
        this.toast.success("Category updated!");
        this.getCategories();
      }).catch((err) => {
        this.toast.error("Something went wrong!");
        console.log(err);
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

</style>