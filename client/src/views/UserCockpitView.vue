<template>
  <main v-if="user">
    <h3>Hi {{ user.firstname || user.username }}</h3>
    <ul class="nav nav-tabs mt-5" id="adminTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="stats-tab" data-bs-toggle="tab" data-bs-target="#stats" type="button" role="tab" aria-controls="stats" aria-selected="true">
          <font-awesome-icon icon="chart-bar" />Statistics
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="recent-tab" data-bs-toggle="tab" data-bs-target="#recent" type="button" role="tab" aria-controls="recent" aria-selected="false">
          <font-awesome-icon icon="history" />Recent Activities
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="account-tab" data-bs-toggle="tab" data-bs-target="#account" type="button" role="tab" aria-controls="account" aria-selected="false">
          <font-awesome-icon icon="user" />Account
        </button>
      </li>
    </ul>
    <div class="tab-content" id="userTabContent">
      <div class="tab-pane fade show active" id="stats" role="tabpanel" aria-labelledby="stats-tab">
        <h4>Your Statistics</h4>
        <div class="container" v-if="statistics">
          <div class="row justify-content-md-center">
            <div class="col-md-6" v-if="statistics.questionsCount || statistics.answersCount">
              <div>
                <Doughnut :data="doughnutChartData" :options="options"/>
              </div>
              <div class="mt-3">
                <h5>Questions</h5>
                <div><b>Asked:</b> {{ statistics.questionsCount }}</div>
                <div><b>Answered:</b> {{ statistics.answersCount }}</div>
              </div>
            </div>
            <div class="col-md-6 pt-5 text-center" v-else>
              <span>Yeah... ahm, nothing to see here so far. Ask your first Question or try to answer a Question to see something here.</span>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="recent" role="tabpanel" aria-labelledby="recent-tab">
        <h4>Your Recent Activities</h4>
        <div class="activities-container mt-3">
          <div v-if="statistics.questionsCount || statistics.answersCount" class="row">
            <div class="col-md-6">
              <h5>Questions</h5>
              <ul class="user-activities">
                <li v-for="question of recent.questions" :key="question.id">
                  <router-link :to="{name: 'Question View', params:{id: question.id}}">
                    {{ question.content.replace(/<.+?>/g, '').slice(0, 50) }}
                  </router-link>
                </li>
              </ul>
            </div>
            <div class="col-md-6">
              <h5>Answers</h5>
              <ul class="user-activities" v-if="recent.answers">
                <template v-for="answer of recent.answers" :key="answer.id">
                  <li v-if="answer.question?.id">
                    <router-link :to="{name: 'Question View', params:{id: answer.question.id}}">
                      {{ answer.content.replace(/<.+?>/g, '').slice(0, 50) }}
                    </router-link>
                  </li>
                </template>
              </ul>
            </div>
          </div>
          <div v-else class="row justify-content-md-center">
            <div class="col-md-6 pt-5 text-center">
              <span>Yeah... ahm, nothing to see here so far. Ask your first Question or try to answer a Question to see something here.</span>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="account" role="tabpanel" aria-labelledby="account-tab">
        <h4>Your Account</h4>
        <UserAccountEditForm :user="user" @update-user="getUserData" />
      </div>
    </div>
  </main>
</template>

<script>
import {useUserStore} from "@/stores/UserStore";
import axios from "axios";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import {Doughnut} from 'vue-chartjs'
import UserAccountEditForm from "@/components/UserAccountEditForm.vue";

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  name: "UserCockpitView",
  inject: ["host"],
  components: {
    UserAccountEditForm,
    Doughnut
  },
  data() {
    return {
      user: null,
      statistics: null,
      recent: null,
      userStore: useUserStore(),
      doughnutChartData: {
        labels: ['Questions', 'Answers'],
        datasets: [
          {
            data: [0, 0],
            backgroundColor: [
              '#0CAFFF',
              '#292e40',
            ],
            hoverOffset: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Questions vs Answers'
          }
        }
      }
    }
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    getUserData() {
      axios.get(this.host + "/users/me", {
        headers: this.userStore.getReqHeaders
      })
          .then(response => {
            if (response.data.payload.token) {
              this.userStore.setToken(response.data.payload.token);
            }
            this.user = response.data.payload.user;
            this.statistics = response.data.payload.statistics;
            this.recent = response.data.payload.recent;
            this.doughnutChartData.datasets[0].data = [this.statistics.questionsCount, this.statistics.answersCount]
          })
          .catch(err => {
            console.log(err)
          });
    },
  },
}
</script>

<style lang="scss" scoped>


</style>