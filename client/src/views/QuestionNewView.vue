<template>
  <main class="question-page">
    <div class="container">
      <h1>Your Question</h1>
      <div id="editor">
        <editor :init="init" v-model="text" />
      </div>
      <div class="select-section mt-5">
        <div class="container">
          <div class="row">
            <div class="col">
              <label class="selection-title" for="category">Category:</label>
              <select id="category" v-model="category_id" class="form-select mb-3" aria-label="Select category">
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
                               :limit="3"
                               :add-tag-on-keys="[13]">
              </vue3-tags-input>
              <span class="text-meta text-small">You can set up to three tags</span>
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
        <button id="save-new-question-btn" class="btn btn-primary" @click="saveQuestion">
          <font-awesome-icon icon="save" />
          Save
        </button>
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
import Editor from '@tinymce/tinymce-vue'
import axios from "axios";

import 'tinymce/plugins/lists/plugin'
import 'tinymce/plugins/link/plugin'
import 'tinymce/plugins/image/plugin'
import 'tinymce/plugins/table/plugin'
import 'tinymce/plugins/code/plugin'
import 'tinymce/plugins/help/plugin'
import 'tinymce/plugins/wordcount/plugin'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "QuestionNew",
  inject: ['host', 'editorInit'],
  data() {
    return {
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
    FontAwesomeIcon,
    'editor': Editor,
    Vue3TagsInput
  },
  methods: {
    getCategories() {
      axios.get(this.host + '/categories')
          .then(response => {
            this.categories = response.data
          })
          .catch(err => {
            console.log(err)
          })
    },
    saveQuestion() {
      if (this.category_id === false || this.category_id === "") {
        this.toast.error("Please select a category")
        return
      }
      if(this.text.length > 100000){
        this.toast.error("Oh, wow! Your Question is too long, please shorten it.")
        return
      }
      if(this.text.replace(/&nbsp;/g," ").trim().length < 20){
        this.toast.error("Please be more specific, your question is too short")
        return
      }
      axios.post(this.host + "/questions/create", {
        content: this.text.trim(),
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
          .catch(err => {
            if(err.response.status === 403 && err.response.data.errorCode === "u-342"){
              this.toast.error("Your Session has expired\nPlease Login again");
              this.userStore.logout()
            }else{
              console.log(err);
              this.toast.error("Question could not be saved")
            }
          })
    },
    handleChangeTag(tags) {
      this.tags = tags;
    },
    customValidateTags(value) {
      return !swearWords().includes(value) && value.trim().length > 0
    }
  },
  mounted() {
    this.getCategories();
  }
}
</script>

<style lang="scss">

</style>