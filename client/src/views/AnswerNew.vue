<template>
  <main>
    <div class="card">
      <div class="card-body">
        <div class="question-header">
          <div class="row align-middle">
            <div class="col-auto">
              <div class="userIcon">
                <font-awesome-icon icon="question"/>
              </div>
            </div>
            <div class="col-md-8 align-self-center">
              <table class="table mb-0 align-middle">
                <tr class="align-middle">
                  <th>
                    <font-awesome-icon icon="user"/>
                  </th>
                  <td>{{ question.username ? question.username : "Anonymous" }}</td>
                  <th>
                    <font-awesome-icon icon="box"/>
                  </th>
                  <td>{{ question.categoryTitle }}</td>
                </tr>
                <tr>
                  <th>
                    <font-awesome-icon icon="calendar"/>
                  </th>
                  <td>{{ new Date(question.created_at).toLocaleString() }}</td>
                  <template v-if="question.tags">
                    <th>
                      <font-awesome-icon icon="tags"/>
                    </th>
                    <td>
                      <span class="tag" v-for="tag in question.tags" :key="tag.id"> <font-awesome-icon
                          icon="tag"/> {{ tag.title }}</span>
                    </td>
                  </template>

                </tr>
              </table>
            </div>
          </div>
          <hr>
        </div>
        <div class="question-content" v-html="question.content"></div>
        <div v-if="question.answers" class="question-answers mt-5">
          <h3>{{ question.answers.length }} Answers</h3>
          <div class="answer" v-for="answer in question.answers" :key="answer.id">
            <div class="row align-middle">
              <div class="col-auto">
                <div class="userIcon">
                  <font-awesome-icon icon="user"/>
                </div>
              </div>
              <div class="col-md-8 align-self-center">
                <table class="table mb-0 align-middle">
                  <tr class="align-middle">
                    <th>
                      <font-awesome-icon icon="user"/>
                    </th>
                    <td>{{ answer.username ? answer.username : "Anonymous" }}</td>
                  </tr>
                  <tr>
                    <th>
                      <font-awesome-icon icon="calendar"/>
                    </th>
                    <td>{{ new Date(answer.created_at).toLocaleString() }}</td>
                  </tr>
                </table>
              </div>
            </div>
            <hr>
            <div class="answer-content" v-html="answer.content"></div>
          </div>
        </div>
        <div v-if="userStore.getTokens.token" class="question-answer mt-5">
          <div class="editor-container">
            <Editor v-model="answer" :init="init"/>
            <button class="btn btn-primary" @click="handleSaveAnswerClicked">Post Answer</button>
          </div>
        </div>
        <div v-else>
          You need to be logged in to answer this question.
        </div>
      </div>
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
import {useUserStore} from "@/stores/UserStore";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";


export default {
  name: "Edit",
  inject: ["host", 'headers'],
  props: {
    question_id: {
      type: Number,
      required: true,
    },

  },
  data() {
    return {
      question: {},
      errorMessage: "",
      category: "",
      created_at: "",
      username: "",
      anonymous: false,
      answer: "",
      editor: null,
      userStore: useUserStore()

    }
  },
  setup() {
    return {
      init: {
        skin: false,
        branding: false,
        height: "300",
        menubar: false,
        contextmenu: false,
        resize: false,
        toolbar: 'undo redo | bold italic underline code | link image',
        font_formats: "Arial=arial,helvetica,sans-serif;",

        formats: {
          // Changes the default format for h1 to have a class of heading
          p: {block: 'p'}
        },
        style_formats: [
          // Adds the h1 format defined above to style_formats
          {title: 'Paragraph', format: 'p'}
        ],
        plugins: 'lists link image code help wordcount',
        content_css: false,
        content_style: "body { font-family: Arial; }",

      },
    }
  },
  components: {
    FontAwesomeIcon,
    Editor,
    ErrorMessageContainer,
  },

  computed: {},
  mounted() {
    this.getQuestionById(this.$route.params.id);
  },
  methods: {
    getQuestionById(id) {
      if (!id) return;
      axios.get(`${this.host}/questions/${id}`)
          .then((response) => {
            console.log(response.data.question);
            this.question = response.data.question;
          })
          .catch((err) => {
            console.log(err);
          });
    },
    handleSaveAnswerClicked() {
      // Store answertext in store (backup)
      this.userStore.setAnswerText(this.answer);
      // Send answertext to server
      this.saveAnswer();
    },
    saveAnswer() {
      console.log(this.text);
      console.log(this.question_id);

      axios.post(this.host + "/answers/create", {
        content: this.text,
        question_id: this.question_id,
      }, {
        headers: this.headers
      })
          .then(response => {
            if (response.data.payload.token) {
              this.userStore.setToken(response.data.payload.token)
            }
            this.userStore.clearAnswerText();
            // this.$router.push({name: 'Home'})
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

.question-content {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 3rem;
}

.btn {
  font-size: 1.2rem;
  background-color: var(--dark);
  border-radius: 0.375rem;
  color: (var(--light));
  padding: 14px 20px;
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

.question-header {
  color: var(--dark);

  & table {

  }
}

.userIcon {
  width: 5rem;
  height: 5rem;
  border-radius: 0.375rem;
  background-color: var(--dark);
  margin: 0 auto;
  position: relative;

  & > svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--light);
    font-size: 3rem;
  }
}

.tag {
  background-color: var(--dark);
  color: var(--light);
  padding: 0.2rem .4rem;
  border-radius: 0.25rem;
  margin: 0.25rem;
  font-size: .8rem;
  font-weight: 100;
  display: inline-block;
}

</style>