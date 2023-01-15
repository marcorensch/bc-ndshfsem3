<template>
  <main>
    <div class="card question-detail">
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
        </div>
        <hr>
        <div class="question-content" v-html="question.content"></div>
        <div v-if="answers" class="question-answers mt-5">
          <h4>{{ answers.length }} Answers</h4>
          <div class="answer" v-for="answer in answers" :key="answer.id">
            <div class="answer-box" :class="{accepted: answer.id === question.accepted_id}">
              <div class="row">
                <div class="col-1 text-center">
                  <div class="vote-action vote-up" @click="handleAnswerVoteClicked(1, answer.id)">
                    <font-awesome-icon icon="caret-up"/>
                  </div>
                  <div class="vote-value">22</div>
                  <div class="vote-action  vote-down" @click="handleAnswerVoteClicked(-1, answer.id)">
                    <font-awesome-icon icon="caret-down"/>
                  </div>
                </div>
                <div class="col">
                  <div class="answer-content" v-html="answer.content"></div>
                  <div class="mt-3 text-small text-muted">
                    <div>
                      {{ new Date(answer.created_at).toLocaleString() }}
                    </div>
                    <div class="mt-1">
                      by {{ answer.username ? answer.username : "Anonymous" }}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="userStore.getTokens.token" class="question-answer mt-5">
          <div class="editor-container">
            <h4>Your Answer</h4>
            <Editor v-model="answer" :init="init"/>
            <div class="mt-3">
              <button class="btn btn-primary" @click="handleSaveAnswerClicked">Post Answer</button>
            </div>
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
  inject: ["host"],
  props: ['id'],
  components: {
    FontAwesomeIcon,
    Editor,
    ErrorMessageContainer,
  },
  data() {
    return {
      question: {},
      errorMessage: "",
      category: "",
      created_at: "",
      username: "",
      anonymous: false,
      answers: [],
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
  mounted() {
    this.getQuestionById(this.$route.params.id);
  },
  methods: {
    getQuestionById(id) {
      if (!id) return;
      axios.get(`${this.host}/questions/${id}`)
          .then((response) => {
            this.question = response.data.question;
            this.answers = response.data.answers;
            console.log(this.question);
          })
          .catch((err) => {
            console.log(err);
          });
    },

    handleSaveAnswerClicked() {
      console.log(this.answer);
      // Store answertext in store (backup)
      this.userStore.setAnswerText(this.answer);
      // Send answertext to server
      this.saveAnswer();
    },

    handleAnswerVoteClicked(vote, id){
      axios.post(`${this.host}/answers/${id}/vote`, {
        vote
      }, {
        headers: this.userStore.getReqHeaders
      })
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.log(err);
          });
    },
    saveAnswer() {
      console.log(this.answer);
      axios.post(this.host + "/answers/create", {
        content: this.answer,
        question_id: this.question.id,
      }, {
        headers: this.userStore.getReqHeaders
      })
          .then(response => {
            if (response.data.payload?.token) {
              this.userStore.setToken(response.data.payload.token)
            }
            this.userStore.clearAnswerText();
            // this.$router.push({name: 'Home'})
          })
          .catch(error => {
            console.log(error);
          })
    },
  },
}
</script>

<style lang="scss">

</style>