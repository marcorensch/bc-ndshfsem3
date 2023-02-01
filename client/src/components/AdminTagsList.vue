<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h4>Add Tag</h4>
        <div class="form-group">
          <div class="row g-0">
            <div class="col">
              <input
                type="text"
                class="form-control"
                id="new_tag_title"
                placeholder="Enter a new Tag"
                @keyup="handleAddTagByEnter"
              />
            </div>
            <div class="col-auto align-self-center">
              <button class="btn btn-primary btn-large" @click="handleAddTag">
                Add Tag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <input
        type="text"
        id="search_tag"
        class="form-control w-100"
        placeholder="Search for Tag"
        @keyup="filterTagList"
      />
    </div>
    <div class="mt-3 table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th class="col-1">ID</th>
            <th class="col-8">Title</th>
            <th class="col-2 text-center">Articles</th>
            <th class="col-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="tags.length > 0">
            <tr
              v-for="tag in tags"
              :key="tag.id"
              :data-tag-id="tag.id"
              :class="{ hidden: !tag.visible }"
            >
              <td
                data-toggle="tooltip"
                data-placement="top"
                title="Tag ID"
                class="align-middle"
              >
                {{ tag.id }}
              </td>
              <td
                data-toggle="tooltip"
                data-placement="top"
                title="Title"
                class="align-middle"
              >
                <span
                  class="editable-title"
                  :id="'tag-' + tag.id + '-title'"
                  :data-tag-title="tag.title"
                  @click="handleEditTag"
                  v-if="!tag.edit"
                >
                  {{ tag.title }}
                </span>
                <div v-else :data-tag-id="tag.id">
                  <div class="row">
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        :id="'tag_title_' + tag.id"
                        :value="tag.title"
                      />
                    </div>
                    <div class="col-auto align-self-center">
                      <div
                        class="btn-group"
                        role="group"
                        aria-label="Tag Title Actions"
                      >
                        <button
                          title="Cancel Changes"
                          type="button"
                          class="btn btn-warning"
                          @click="handleUnsetEditClicked"
                        >
                          <font-awesome-icon icon="times" />
                        </button>
                        <button
                          title="Save Changes"
                          type="button"
                          class="btn btn-success"
                          @click="handleTagTitleUpdate"
                        >
                          <font-awesome-icon icon="save" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="text-center align-middle">{{ tag.articlesCount }}</td>
              <td class="align-middle text-center">
                <div class="row gx-0">
                  <div class="col-6">
                    <button
                      data-toggle="tooltip"
                      data-placement="top"
                      :title="'Delete ' + tag.title"
                      class="action-button delete-btn-icon"
                      @click="handleDeleteTagClicked"
                    >
                      <font-awesome-icon icon="trash" />
                    </button>
                  </div>
                  <div class="col-6">
                    <button
                      :title="'Edit ' + tag.title + ' Tag'"
                      class="action-button edit-btn-icon"
                      @click="handleEditTag"
                    >
                      <font-awesome-icon icon="pencil" @click="handleEditTag" />
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
import { useUserStore } from "@/stores/UserStore";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useToast } from "vue-toastification";

export default {
  name: "AdminTagsList",
  components: { FontAwesomeIcon },
  inject: ["host"],
  data() {
    return {
      tags: [],
      userStore: useUserStore(),
      toast: useToast(),
    };
  },
  mounted() {
    this.getTags();
    document.addEventListener("keyup", this.handleKeyUp);
  },
  methods: {
    debounce(func, timeout = 400) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, args);
        }, timeout);
      };
    },
    filterTagList() {
      const processChange = this.debounce(() => {
        const search = document.getElementById("search_tag").value;
        if (search.length > 0) {
          for (const cat of this.tags) {
            cat.visible = cat.title
              .toLowerCase()
              .includes(search.toLowerCase());
          }
        } else {
          for (const cat of this.tags) {
            cat.visible = true;
          }
        }
      });
      processChange();
    },
    handleSortByTitle() {
      this.tags.sort((a, b) => {
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
      this.tags.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
        return 0;
      });
    },
    handleAddTagByEnter(e) {
      if (e.key === "Enter") {
        this.handleAddTag(e);
      }
    },
    handleKeyUp(e) {
      if (e.key === "Escape") {
        this.handleUnsetEditClicked();
      }
    },
    getTags() {
      axios
        .get(`${this.host}/tags`, {})
        .then((response) => {
          this.tags = response.data.map((tag) => {
            tag.visible = true;
            return tag;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    checkIfTagExists(title, id) {
      return this.tags.some((tag) => {
        return tag.id !== id && tag.title === title;
      });
    },
    getTagIdFromTable(event) {
      return Number(event.target.closest("tr").dataset.tagId);
    },
    handleEditTag(event) {
      const tagID = this.getTagIdFromTable(event);
      for (const tagItem of this.tags) {
        tagItem.edit = tagItem.id === tagID;
      }
    },
    handleTagTitleUpdate(event) {
      const tagId = this.getTagIdFromTable(event);
      const newValue = document.getElementById("tag_title_" + tagId).value;
      if (newValue.trim() === "") {
        this.toast.warning("Tag title cannot be empty!");
        return;
      }
      if (this.checkIfTagExists(newValue, tagId)) {
        this.toast.error("Tag already exists!");
        return;
      }
      const tag = this.tags.find((tag) => {
        if (tag.id === tagId) return tag;
      });
      if (tag.title !== newValue) {
        tag.title = newValue;
        this.handleUpdateTag(tag);
      }
    },
    handleAddTag(e) {
      e.preventDefault();
      const inputField = document.getElementById("new_tag_title");
      let title = inputField.value;
      inputField.value = "";
      if (title.trim() === "") {
        this.toast.warning("Tag title cannot be empty!");
        return;
      }
      if (this.checkIfTagExists(title)) {
        this.toast.error("Tag already exists!");
        return;
      }
      axios
        .post(
          `${this.host}/tags/create`,
          {
            title: title,
          },
          {
            headers: this.userStore.getReqHeaders,
          }
        )
        .then((response) => {
          this.toast.success("Tag added!");
          this.getTags();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleDeleteTagClicked(event) {
      const catId = this.getTagIdFromTable(event);
      const tag = this.tags.find((tag) => {
        if (tag.id === catId) return tag;
      });
      this.handleDeleteTag(tag);
    },
    handleDeleteTag(tag) {
      let selection = confirm(
        `Are you sure you want to delete the tag ${tag.title}?`
      );
      if (selection) {
        axios
          .delete(`${this.host}/tags/${tag.id}`, {
            headers: this.userStore.getReqHeaders,
          })
          .then(() => {
            this.toast.success("Tag deleted!");
            this.tags = this.tags.filter((c) => c.id !== tag.id);
          })
          .catch((err) => {
            this.toast.error("Something went wrong!");
            console.log(err);
          });
      }
    },
    handleUpdateTag(tag) {
      axios
        .put(
          `${this.host}/tags/${tag.id}`,
          {
            title: tag.title,
            fav: tag.fav,
          },
          {
            headers: this.userStore.getReqHeaders,
          }
        )
        .then(() => {
          this.toast.success("Tag updated!");
          this.getTags();
        })
        .catch((error) => {
          this.toast.error("Something went wrong!");
          console.log(error);
        });
    },
    handleUnsetEditClicked() {
      this.tags.forEach((tag) => {
        tag.edit = false;
      });
    },
  },
};
</script>

<style scoped></style>
