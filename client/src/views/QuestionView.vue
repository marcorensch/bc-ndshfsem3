<template>
  <main>
    <div v-if="question" class="card question-detail">
      <div class="card-body">
        <div class="question-header">
          <div class="row align-middle">
            <div class="col-auto align-middle">
              <div class="userIcon">
                <font-awesome-icon icon="question"/>
              </div>
            </div>
            <div class="col-md-9 align-self-center">
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
            <div class="col-1 text-center">
              <div class="vote-action vote-up" @click="handleQuestionVoteClicked(1)" :class="{voted: checkIfUserHasVotedForQuestion(1), disabled : !canVote() }">
                <font-awesome-icon icon="caret-up"/>
              </div>
              <div class="vote-value-question">{{ question.votes.total }}</div>
              <div class="vote-action vote-down" @click="handleQuestionVoteClicked(-1)" :class="{voted: checkIfUserHasVotedForQuestion(-1), disabled : !canVote() }">
                <font-awesome-icon icon="caret-down"/>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <div class="question-content p-2" v-html="question.content"></div>
        <div v-if="answers" class="question-answers p-2 mt-5">
          <h4>{{ answers.length }} Answers</h4>
          <div class="answer" v-for="answer in answers" :key="answer.id">
            <div class="answer-box" :class="{accepted: answer.id === question.accepted_id}">
              <div class="actions-container" v-if="userStore.isAdmin || canMarkSolved() || canDeleteAnswer(answer.created_by) || canEditAnswer(answer.created_by)">
                <div v-if="canMarkSolved()" class="action" @click="handleMarkedAnswerClicked(answer.id)">
                  <font-awesome-icon icon="check" />
                </div>
                <div v-if="canDeleteAnswer(answer.created_by)" class="action" @click="handleDeleteAnswerClicked(answer.id)">
                  <font-awesome-icon icon="trash" />
                </div>
                <div v-if="canEditAnswer(answer.created_by)" class="action" @click="handleEditAnswerClicked(answer.id)">
                  <font-awesome-icon icon="pencil" />
                </div>
              </div>
              <div class="row">
                <div class="col-1 text-center">
                  <div class="vote-action vote-up" @click="handleAnswerVoteClicked(1, answer.id)" :class="{voted: checkIfUserHasVotedForAnswer(1, answer.id), disabled : !canVote()  }">
                    <font-awesome-icon icon="caret-up"/>
                  </div>
                  <div class="vote-value">{{answer.votes.total}}</div>
                  <div class="vote-action vote-down" @click="handleAnswerVoteClicked(-1, answer.id)" :class="{voted: checkIfUserHasVotedForAnswer(-1, answer.id), disabled : !canVote()  }">
                    <font-awesome-icon icon="caret-down"/>
                  </div>
                </div>
                <div class="col align-middle">
                  <div>
                    <div class="answer-content" v-html="answer.content"></div>
                    <div class="mt-3 text-small text-muted text-sm-end">
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
        </div>
        <div v-if="userStore.getTokens.token" class="question-answer p-2 mt-5">
          <div class="editor-container">
            <h4>Your Answer</h4>
            <Editor v-model="answer" :init="init"/>
            <div class="mt-3">
              <button class="btn btn-primary" @click="handleSaveAnswerClicked">Post Answer</button>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="text-center">
            <h4 class="p-5">You need to be logged in to answer questions</h4>
          </div>
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
      question: null,
      errorMessage: "",
      category: "",
      created_at: "",
      username: "",
      anonymous: false,
      answers: [],
      answer: "",
      editor: null,
      user: null,
      userStore: useUserStore()
    }
  },
  computed:{

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
    this.user = this.userStore.getUser;
  },
  methods: {
    checkIfUserHasVotedForQuestion(vote) {
      if (this.user) {
        const votes = this.question.votes.data;
        const voting = votes.find(vote => vote.user_id === this.user.id);
        return voting?.vote === vote
      }
      return false;
    },
    checkIfUserHasVotedForAnswer(vote, answerId) {
      if (this.user) {
        const votes = this.answers.find(answer => answer.id === answerId).votes;
        const voting = votes.data.find(vote => vote.user_id === this.user.id);
        return voting?.vote === vote
      }
      return false;
    },
    getQuestionById(id) {
      if (!id) return;
      axios.get(`${this.host}/questions/${id}`)
          .then((response) => {
            this.question = response.data.question;
            this.answers = response.data.answers;
            console.log(this.question);
            console.log(this.answers);
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
    handleQuestionVoteClicked(vote){
      if(!this.canVote()) return;
      if(this.userStore.getUser.id === this.question.created_by){
        alert("You can't vote on your own question");
        return;
      }
      axios.post(`${this.host}/questions/${this.question.id}/vote`, {
        vote
      }, {
        headers: this.userStore.getReqHeaders
      })
          .then((response) => {
            if(response.data?.payload?.token){
              this.userStore.setToken(response.data.payload.token);
            }
            this.getQuestionById(this.$route.params.id);
          })
          .catch((err) => {
            console.log(err);
          });
    },
    handleAnswerVoteClicked(vote, id){
      if(!this.canVote()) return;
      if(this.userStore.getUser.id === this.answers.find(answer => answer.id === id).created_by){
        alert("You can't vote on your own answer");
        return;
      }
      axios.post(`${this.host}/answers/${id}/vote`, {
        vote
      }, {
        headers: this.userStore.getReqHeaders
      })
          .then((response) => {
            if(response.data?.payload?.token){
              this.userStore.setToken(response.data.payload.token);
            }
            this.getQuestionById(this.$route.params.id);
          })
          .catch((err) => {
            console.log(err);
          });
    },
    saveAnswer() {
      axios.post(this.host + "/answers/create", {
        content: this.answer,
        question_id: this.question.id,
      }, {
        headers: this.userStore.getReqHeaders
      }).then(response => {
          if (response.data.payload?.token) {
            this.userStore.setToken(response.data.payload.token)
          }
          this.userStore.clearAnswerText();
          this.answer = "";
          this.getQuestionById(this.$route.params.id);
      }).catch(error => {
          console.log(error);
      })
    },

    canMarkSolved(){
      return this.userStore.getTokens.token && this.userStore.getUser.id === this.question.created_by
    },
    canDeleteAnswer(createdUserId){
      return this.userStore.getTokens.token && this.userStore.getUser.id === createdUserId || this.userStore.isAdmin
    },
    canEditAnswer(createdUserId){
      return this.userStore.getTokens.token && this.userStore.getUser.id === createdUserId || this.userStore.isAdmin
    },
    canVote(){
      return this.userStore.getTokens.token
    },
  },
}
</script>

<style lang="scss">

</style>