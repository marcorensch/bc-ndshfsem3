<template>
  <main class="question-page">
    <div class="container">
      <h1>Your Question</h1>

      <div id="editor">
        <editor
            :init="init"
            v-model="text"
        />
      </div>
      <div class="select-section mt-5">
        <div class="container">
          <div class="row">
            <div class="col">
              <label class="selection-title" for="category">Category:</label>
              <select id="category" v-model="category_id" class="form-select mb-3" aria-label="Default select example">
                <option selected value="">Please select one</option>
                <option v-for="cat in categories" v-bind:value="cat.id">
                  {{ cat.title }}
                </option>
              </select>
            </div>
            <div class="col">
              <label class="selection-title">Tags: </label>
              <vue3-tags-input :tags="tags"
                               placeholder="enter some tags"
                               @on-tags-changed="handleChangeTag"
                               :validate="customValidateTags"
                               :allow-duplicates="false"
                               :add-tag-on-keys="[13]">
              </vue3-tags-input>
            </div>
            <div class="col">
              <label class="selection-title">Ask anonymously:</label>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="ask_anonymous" v-model="anonymous">
                <label class="form-check-label" for="ask_anonymous">
                  Ask anonymously
                </label>
              </div>
            </div>
          </div>
        </div>

        <button class="btn btn-primary" @click="saveQuestion">Save</button>

      </div>
    </div>

  </main>
</template>

<script>
import 'tinymce/tinymce'
import 'tinymce/icons/default/icons'
import 'tinymce/themes/silver/theme'
import 'tinymce/skins/ui/oxide/skin.css'
import Vue3TagsInput from 'vue3-tags-input';
import {swearWords} from '../utils/BadWords.mjs'
import {useUserStore} from "@/stores/UserStore";
import {useToast} from "vue-toastification";

// TinyMCE plugins
// https://www.tiny.cloud/docs/tinymce/6/plugins/
import 'tinymce/plugins/lists/plugin'
import 'tinymce/plugins/link/plugin'
import 'tinymce/plugins/image/plugin'
import 'tinymce/plugins/table/plugin'
import 'tinymce/plugins/code/plugin'
import 'tinymce/plugins/help/plugin'
import 'tinymce/plugins/wordcount/plugin'

import Editor from '@tinymce/tinymce-vue'
import axios from "axios";

export default {
  name: "QuestionNew",
  inject: ['host', 'editorInit'],

  data() {
    return {
      errorMessage: "",
      category_id: false,
      anonymous: false,
      categories: [],
      text: "",
      editor: null,
      tags: [],
      userStore: useUserStore(),
      init: this.editorInit,
      toast: useToast()
    }
  },
  components: {
    'editor': Editor,
    Vue3TagsInput
  },
  methods: {
    getCategories() {
      axios.get(this.host + '/categories')
          .then(response => {
            this.categories = response.data
          })
          .catch(error => {
            console.log(error)
          })
    },
    saveQuestion() {
      if (this.category_id === false) {
        this.toast.error("Please select a category")
        return
      }

      if(this.text.length > 100000){
        this.toast.error("Oh, wow! Your Question is too long, please shorten it.")
        return
      }

      if(this.text.length < 20){
        this.toast.error("Please be more specific, your question is too short")
        return
      }

      axios.post(this.host + "/questions/create", {
        content: this.text,
        category_id: this.category_id,
        tags: this.tags,
        anonymous: this.anonymous,
      }, {
        headers: this.userStore.getReqHeaders
      })
          .then(response => {
            if (response.data.payload.token) {
              this.userStore.setToken(response.data.payload.token)
            }
            this.toast.success("Question saved successfully")
            this.$router.push({name: 'Home'})
          })
          .catch(error => {
            console.error(error)
            this.toast.error("Question could not be saved")
          })
    },
    handleChangeTag(tags) {
      this.tags = tags;
    },

    customValidateTags(value) {
      return !swearWords().includes(value)
    }
  },

  async mounted() {
    this.getCategories();
  }

}
</script>

<style lang="scss">
.v3ti .v3ti-tag {
  background: var(--dark);
  height: 30px;
}

.v3ti .v3ti-tag .v3ti-remove-tag {
  color: var(--light);
  transition: color .3s;

}

.v3ti .v3ti-tag .v3ti-remove-tag {
  text-decoration: none;
}

.v3ti .v3ti-tag .v3ti-remove-tag:hover {
  color: #ffffff;
}
</style>

<style lang="scss" scoped>

.select-section {
  display: flex;
  flex-direction: column;
}

ul {
  list-style: none;
}

.btn {
  font-size: 1.2rem;
  background-color: var(--dark);
  border-radius: 2px;
  color: (var(--light));
  padding: 14px 20px;
  margin: 10px 10px;
  border: none;
  cursor: pointer;
  width: 200px;
  transition: 0.2s ease-out;

  &:hover {
    background-color: var(--primary);
  }
}

.form-check {
  display: flex;
  align-items: center;
}

.form-check-input {
  height: 30px;
  width: 30px;
  margin-right: 10px;
}

.form-check-input:checked {
  background-color: var(--dark);
}

.selection-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
}


</style>