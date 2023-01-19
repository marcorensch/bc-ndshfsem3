<template>
  <main>
    <div v-if="question" class="card question-detail">
      <div class="card-body">
        <div class="question-header">
          <div class="row d-flex align-items-center">

            <div class="col-auto">
              <div class="userIcon">
                <font-awesome-icon icon="question"/>
              </div>
            </div>

            <div class="col-9">
              <div class="row align-items-center">
                <div class="col-1">
                  <font-awesome-icon icon="user"/>
                </div>
                <div class="col-4">
                  <div class="row g-3">
                    <div class="col-auto">{{ question.username ? question.username : "Anonymous" }}</div>
                    <div class="col-auto text-small align-self-center" v-if="editingQuestion">
                      <input name="ask-anonymous" id="ask-anonymous" type="checkbox" class="form-check-input" v-model="edited.anonymous" /> <label class="d-inline" for="ask-anonymous">Anonymous</label>
                    </div>
                  </div>
                </div>
                <div class="col-1"><font-awesome-icon icon="box"/></div>
                <div class="col-4"><div v-if="!editingQuestion">{{ question.categoryTitle }}</div>
                  <div v-else>
                    <select class="form-select" v-model="edited.category_id" >
                      <option v-for="cat in categories" v-bind:value="cat.id">
                        {{ cat.title }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-1"><font-awesome-icon icon="calendar"/></div>
                <div class="col-4">{{ new Date(question.created_at).toLocaleString() }}</div>
                <div class="col-1"><font-awesome-icon icon="tags"/></div>
                <div class="col-3">
                  <span v-if="!editingQuestion" class="tag" v-for="tag in question.tags" :key="tag.id"> <font-awesome-icon
                    icon="tag"/> {{ tag.title }}</span>
                  <vue3-tags-input  v-else
                                    :tags="edited.tags"
                                    placeholder="enter some tags"
                                    @on-tags-changed="handleChangeTag"
                                    :validate="customValidateTags"
                                    :allow-duplicates="false"
                                    :add-tag-on-keys="[13]">
                  </vue3-tags-input>
                </div>
              </div>
            </div>

            <div class="col-1 text-center">
              <div class="vote-action vote-up" @click="handleQuestionVoteClicked(1)"
                   :class="{voted: checkIfUserHasVotedForQuestion(1), disabled : !canVote() }">
                <font-awesome-icon icon="caret-up"/>
              </div>
              <div class="vote-value-question">{{ question.votes.total }}</div>
              <div class="vote-action vote-down" @click="handleQuestionVoteClicked(-1)"
                   :class="{voted: checkIfUserHasVotedForQuestion(-1), disabled : !canVote() }">
                <font-awesome-icon icon="caret-down"/>
              </div>
            </div>
          </div>
        </div>
        <hr>

        <div v-if="!editingQuestion" class="question-content p-2" v-html="question.content"></div>
        <div v-else>
          <Editor v-model="edited.content" :init="init"/>
        </div>
        <div class="question-actions position-relative pt-3">
          <div class="row justify-content-end">
            <div v-if="!editingQuestion" class="col-auto">
              <div class="btn-group" role="group" aria-label="Question Actions">
                <button v-if="userStore.getTokens.token" type="button" class="btn btn-secondary"
                        @click="scrollTo('#question-answer')">
                  <font-awesome-icon icon="keyboard"/>
                  Answer
                </button>
                <button v-if="canEditQuestion()" type="button" class="btn btn-secondary"
                        @click="handleEditQuestionToggle">
                  <font-awesome-icon icon="pencil"/>
                  Edit
                </button>
                <button v-if="canDeleteQuestion()" type="button" class="btn btn-secondary" @click="handleDeleteClicked">
                  <font-awesome-icon icon="trash"/>
                  Delete
                </button>
              </div>
            </div>
            <div v-else class="col-auto">
              <div class="btn-group" role="group" area-label="Question Edit Actions">
                <button @click="handleUpdateQuestionClicked" type="button" class="btn btn-success">
                  <font-awesome-icon icon="save"/>
                  Save
                </button>
                <button @click="editingQuestion = false" type="button" class="btn btn-warning">
                  <font-awesome-icon icon="trash"/>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="answers" class="question-answers p-2 mt-5">
          <h4>{{ answers.length }} Answers</h4>
          <div class="row pt-3 pb-3">
            <div class="col-3">
              <select name="sortAnswersBy" id="sortAnswersBy" class="form-select" @change="sortAnswerList">
                <option value="votes">Votes</option>
                <option selected value="created_at">Date</option>
              </select>
            </div>
            <div class="col-3">
              <select name="sortAnswersDir" id="sortAnswersDir" class="form-select" @change="sortAnswerList">
                <option selected value="asc">ASC</option>
                <option value="desc">DESC</option>
              </select>
            </div>
            <div v-if="question.accepted_id" class="col-3 d-flex">
              <button @click="scrollTo('#answer-'+question.accepted_id)" class="btn btn-success">
                <font-awesome-icon icon="chevron-down"/>
                Jump to Solution
              </button>
            </div>
          </div>
          <div class="answer" v-for="answer in answers" :key="answer.id">
            <div :id="'answer-'+answer.id" class="answer-box" :class="{accepted: answer.id === question.accepted_id}">
              <div class="actions-container"
                   v-if="userStore.isAdmin || canMarkSolved() || canDeleteAnswer(answer.created_by) || canEditAnswer(answer.created_by)">
                <div v-if="canMarkSolved()" class="action" @click="handleMarkedAnswerClicked(answer.id)">
                  <template v-if="answer.id !== question.accepted_id">
                    <font-awesome-icon icon="check-square" title="Mark as solution"/>
                  </template>
                  <template v-else>
                    <font-awesome-icon icon="minus-square" title="Remove solution marker"/>
                  </template>
                </div>
                <div v-if="canDeleteAnswer(answer.created_by)" class="action"
                     @click="handleDeleteAnswerClicked(answer.id)">
                  <font-awesome-icon icon="trash"/>
                </div>
                <div v-if="canEditAnswer(answer.created_by)" class="action" @click="handleEditAnswerClicked(answer.id)">
                  <font-awesome-icon icon="pencil"/>
                </div>
              </div>
              <div class="row">
                <div class="col-1 text-center">
                  <div class="vote-action vote-up" @click="handleAnswerVoteClicked(1, answer.id)"
                       :class="{voted: checkIfUserHasVotedForAnswer(1, answer.id), disabled : !canVote()  }">
                    <font-awesome-icon icon="caret-up"/>
                  </div>
                  <div class="vote-value">{{ answer.votes.total }}</div>
                  <div class="vote-action vote-down" @click="handleAnswerVoteClicked(-1, answer.id)"
                       :class="{voted: checkIfUserHasVotedForAnswer(-1, answer.id), disabled : !canVote()  }">
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
        <div id="question-answer" v-if="userStore.getTokens.token" class="question-answer p-2 mt-5">
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
import 'tinymce/plugins/codesample/plugin'
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

import Vue3TagsInput from 'vue3-tags-input';
import {swearWords} from '../utils/BadWords.mjs'

import { useToast } from "vue-toastification";


export default {
  name: "Edit",
  inject: ["host", "editorInit"],
  props: ['id'],
  components: {
    FontAwesomeIcon,
    Editor,
    ErrorMessageContainer,
    Vue3TagsInput
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
      userStore: useUserStore(),
      init: this.editorInit,
      editingQuestion: false,
      edited: {
        content: "",
        category_id: null,
        anonymous: false,
        tags: [],
        accepted_id: null
      },
      categories: [],
      toast: useToast()
    }
  },
  computed: {},
  mounted() {
    this.getQuestionById(this.$route.params.id);
    this.user = this.userStore.getUser;

    if (this.userStore.getAnswerText) {
      this.answer = this.userStore.getAnswerText;
    }
  }
  ,
  methods: {
    scrollTo(target) {
      document.querySelector(target).scrollIntoView({behavior: 'smooth'});
    },
    sortAnswerList() {
      const by = document.getElementById("sortAnswersBy").value;
      const direction = document.getElementById("sortAnswersDir").value;
      console.log(by, direction);
      if (by === "votes") {
        if (direction === "asc") {
          this.answers.sort((a, b) => a.votes.total - b.votes.total);
        } else {
          this.answers.sort((a, b) => b.votes.total - a.votes.total);
        }
      } else {
        if (direction === "asc") {
          this.answers.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else {
          this.answers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
      }
    },
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
    handleQuestionVoteClicked(vote) {
      if (!this.canVote()) return;
      if (this.userStore.getUser.id === this.question.created_by) {
        alert("You can't vote on your own question");
        return;
      }
      axios.post(`${this.host}/questions/${this.question.id}/vote`, {
        vote
      }, {
        headers: this.userStore.getReqHeaders
      })
          .then((response) => {
            if (response.data?.payload?.token) {
              this.userStore.setToken(response.data.payload.token);
            }
            this.getQuestionById(this.$route.params.id);
          })
          .catch((err) => {
            console.log(err);
          });
    },
    handleAnswerVoteClicked(vote, id) {
      if (!this.canVote()) return;
      if (this.userStore.getUser.id === this.answers.find(answer => answer.id === id).created_by) {
        alert("You can't vote on your own answer");
        return;
      }
      axios.post(`${this.host}/answers/${id}/vote`, {
        vote
      }, {
        headers: this.userStore.getReqHeaders
      })
          .then((response) => {
            if (response.data?.payload?.token) {
              this.userStore.setToken(response.data.payload.token);
            }
            this.getQuestionById(this.$route.params.id);
          })
          .catch((err) => {
            console.log(err);
          });
    },
    handleDeleteAnswerClicked(id) {
      axios.delete(`${this.host}/answers/${id}`, {
        headers: this.userStore.getReqHeaders
      })
          .then((response) => {
            if (response.data?.payload?.token) {
              this.userStore.setToken(response.data.payload.token);
            }
            this.getQuestionById(this.$route.params.id);
          }).catch((err) => {
        console.log(err);
      });
    },
    handleMarkedAnswerClicked(id) {
      if (this.userStore.getUser.id !== this.question.created_by) {
        console.log("You can't mark an answer on a question you didn't create");
        return;
      }
      axios.put(this.host + "/questions/" + this.question.id + "/answer", {
        content: this.question.content,
        category: this.question.category,
        anonymous: this.question.anonymous,
        accepted_id: id
      }, {
        headers: this.userStore.getReqHeaders
      })
          .then((response) => {
            if (response.data?.payload?.token) {
              this.userStore.setToken(response.data.payload.token);
            }
            this.getQuestionById(this.question.id)
          }).catch((err) => {
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

    handleEditQuestionToggle() {
      this.editingQuestion = !this.editingQuestion;
      if (this.editingQuestion) {
        this.edited.content = this.question.content;
        this.edited.category_id = this.question.category_id;
        this.edited.anonymous = this.question.anonymous;
        this.edited.tags = this.question.tags.map(tag => tag.title);
        this.accepted_id = this.question.accepted_id;

        this.getCategories();
      }

    },

    getCategories() {
      axios.get(this.host + "/categories")
          .then(response => {
            this.categories = response.data;
          }).catch(error => {
        console.log(error);
      })
    },

    handleUpdateQuestionClicked() {
      console.log(this.edited);
      axios.put(this.host + "/questions/" + this.question.id, this.edited, {
        headers: this.userStore.getReqHeaders
      }).then(response => {
        if (response.data.payload?.token) {
          this.userStore.setToken(response.data.payload.token)
        }
        this.getQuestionById(this.$route.params.id);
        this.handleEditQuestionToggle();
        this.toast.success("Question updated!");
      }).catch(error => {
        console.log(error);
        this.toast.error("Question could not be updated");
      })
    },

    handleDeleteClicked() {
      axios.delete(this.host + "/questions/" + this.question.id, {
        headers: this.userStore.getReqHeaders
      }).then(response => {
        if (response.data.payload?.token) {
          this.userStore.setToken(response.data.payload.token)
        }
        this.toast.success("Question deleted");
        this.$router.push({name: "Home"});
      }).catch(error => {
        console.log(error);
        this.toast.error("Question could not be deleted");
      })
    },

    handleChangeTag(tags) {
      this.edited.tags = tags;
    },

    customValidateTags(value) {
      return !swearWords().includes(value)
    },

    canDeleteQuestion() {
      return this.userStore.getTokens.token && this.userStore.getUser.id === this.question.created_by || this.userStore.isAdmin
    },
    canEditQuestion() {
      return this.userStore.getTokens.token && this.userStore.getUser.id === this.question.created_by || this.userStore.isAdmin
    },

    canMarkSolved() {
      return this.userStore.getTokens.token && this.userStore.getUser.id === this.question.created_by
    },
    canDeleteAnswer(createdUserId) {
      return this.userStore.getTokens.token && this.userStore.getUser.id === createdUserId || this.userStore.isAdmin
    },
    canEditAnswer(createdUserId) {
      return this.userStore.getTokens.token && this.userStore.getUser.id === createdUserId || this.userStore.isAdmin
    },
    canVote() {
      return this.userStore.getTokens.token
    },
  },
}
</script>

<style lang="scss">

</style>