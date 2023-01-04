<template>
  <main>
    <div class="card w-100">
      <span class="card-header" >
       {{category}}
    </span>
      <div class="card-body">
        <p class="card-title question-content">{{strippedContent}}</p>

      </div>
      <div class="card-body mb-0">
        <span>asked: {{created_at}}</span>
        <span class="float-end">by
        {{anonymous || !username ? "Anonym" : username}}
      </span>
      </div>
    </div>
    <h1>Your Answer</h1>

    <ErrorMessageContainer :string="errorMessage" />

    <div id="editor">
      <editor
          :init="init"
          v-model="text"
      />
    </div>
    <div class="button-section">
      <button class="btn btn-primary" @click="saveAnswer">Save</button>
    </div>

  </main>


</template>

<script>
import 'tinymce/tinymce'
import 'tinymce/icons/default/icons'
import 'tinymce/themes/silver/theme'
import 'tinymce/skins/ui/oxide/skin.css'
import 'tinymce/plugins/lists/plugin'
import 'tinymce/plugins/link/plugin'
import 'tinymce/plugins/image/plugin'
import 'tinymce/plugins/table/plugin'
import 'tinymce/plugins/code/plugin'
import 'tinymce/plugins/help/plugin'
import 'tinymce/plugins/wordcount/plugin'

import Editor from '@tinymce/tinymce-vue'

import ErrorMessageContainer from "@/components/ErrorMessageContainer.vue";
import { useUserStore } from "@/stores/UserStore";
import axios from "axios";


export default {
  name: "Edit",
  inject: ["host"],
  props: {
    question_id: {
      type: Number,
      required: true,
    },

  },
  data() {
    return {
      question:"",
      question_id:"",
      errorMessage: "",
      category:"",
      created_at:"",
      username:"",
      anonymous:false,
      text:"",
      editor: null,
      userStore: useUserStore()

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
  },

  computed: {
    strippedContent() {
      let regex = /(<([^>]+)>)/ig;
      let string = this.question.replace(regex, "");
      const length = 100;
      return (string.length > length) ? string.slice(0, length-1).trim() + '...' : string;
    }
  },
  mounted() {
    this.getQuestionById(this.$route.params.id);

  },
  methods: {
    getQuestionById(id){
      if(!id) return;
      axios.get(`${this.host}/questions/${id}`)
      .then((response) => {
        console.log(response.data.question);
        this.question_id = response.data.question.id;
        this.question = response.data.question.content;
        this.category = response.data.question.categoryTitle;
        this.created_at = new Date(response.data.question.created_at).toLocaleString();
        this.anonymous = response.data.question.anonymous;


      })
      .catch((err) => {
        console.log(err);
      });
    },
    saveAnswer(){
      console.log(this.text);
      console.log(this.question_id);

      axios.post(this.host + "/answers/create", {
        content: this.text,
        question_id: this.question_id,

      },{
        headers : {
          'Authorization': `Bearer ${this.userStore.getTokens.token}`,
          'RefreshToken': `${this.userStore.getTokens.refreshToken}`,
        }
      })
          .then(response => {
            if(response.data.payload.token){
              this.userStore.setToken(response.data.payload.token)
            }
            this.$router.push({ name: 'Home' })
          })
          .catch(error => {
            this.errorMessage = error.response.data.message
          })
    },
  },
}
</script>

<style lang="scss" scoped>

.card {
  margin: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: 0.3s ease-out;
  height: 300px;

  .card-header {
    background-color: var(--dark);
    color: var(--light);
    font-size: 1rem;
  }
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    transition: 0.3s ease-out;
  }
}

.question-content{
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 3rem;
}
.btn{
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

.button-section {
  margin-top: 20px;
}

h1 {
  margin-top: 30px;

}


</style>