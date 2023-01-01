<template>
  <main class="question-page">
    <div class="container">
      <h1>Your Question</h1>

      <ErrorMessageContainer :string="errorMessage" />

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
              <label for="category">Category:</label>
              <select id="category" v-model="category_id" class="form-select mb-3" aria-label="Default select example">
                <option selected value="">Please select one</option>
                <option v-for="cat in categories" v-bind:value="cat.id">
                  {{ cat.title }}
                </option>
              </select>
            </div>
            <div class="col">
              <label>Tags: </label>
              <vue3-tags-input  :tags="tags"
                                :validate="customValidate"
                               placeholder="enter some tags"
                               @on-tags-changed="handleChangeTag"/>
            </div>
            <div class="col">
              <span>Ask Anonymously</span>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="ask_anonymous" v-model="anonymous">
                <label class="form-check-label" for="ask_anonymous">
                  Ask anonymously
                </label>
              </div>
            </div>
          </div>
        </div>

        <button class="btn btn-primary" @click="saveQuestion">confirm</button>

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

import ErrorMessageContainer from "@/components/ErrorMessageContainer.vue";

export default {
  name: "QuestionNew",
  inject: ['host'],

  data(){
    return {
      errorMessage: "",
      category_id: false,
      anonymous: false,
      categories: [],
      text:"",
      editor: null,
      tags:[]


    }
  },
  setup () {
    return {
      init: {
        skin: false,
        branding: false,
        height: "300",
        formats: {
          // Changes the default format for h1 to have a class of heading
          p: { block: 'p' }
        },
        style_formats: [
          // Adds the h1 format defined above to style_formats
          { title: 'Paragraph', format: 'p' }
        ],
        plugins: 'lists link image code help wordcount',
        content_css: false,
        content_style: "body { font-family: Arial; }"
      },
    }
  },
  components: {
    'editor': Editor,
    ErrorMessageContainer,
    Vue3TagsInput
  },
  methods:{
    getCategories(){
      axios.get(this.host + '/categories')
        .then(response => {
          this.categories = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    saveQuestion(){
      axios.post(this.host + "/questions/create", {
        content: this.text,
        category_id: this.category_id,
        tags: this.tags,
        anonymous: this.anonymous,
        refresh_token: localStorage.getItem('refreshToken')
      },{
        headers : {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(response => {
          console.log(response.data.success)
          this.$router.push({ name: 'Home', params: { id: response.data.success.id } })
        })
        .catch(error => {
          this.errorMessage = error.response.data.message
        })
    },
    handleChangeTag(tags) {
      this.tags = tags;
      console.log(this.tags)
    },
    customValidate(value) {
      //todo Regex für erlaubte Tags definieren
      const regex = new RegExp(/^[a-zA-Z]+$/);
      return regex.test(value)
    }
  },

  async mounted() {
    this.getCategories();
  }

}
</script>

<style lang="scss" scoped>

.select-section{
  display: flex;
  flex-direction: column;
}

ul{
  list-style: none;
}

.btn{
  font-size: 1rem;
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


.v3ti .v3ti-tag {
  background: var(--primary);
}

.v3ti .v3ti-tag .v3ti-remove-tag {
  color: var(--light);
  transition: color .3s;
}

.v3ti .v3ti-tag .v3ti-remove-tag:hover {
  color: #ffffff;
}
</style>