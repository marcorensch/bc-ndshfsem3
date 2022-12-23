import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import UserCockpitOverview from "@/views/UserCockpitOverview";
import AnswerNew from "@/views/AnswerNew";
import QuestionNew from "@/views/QuestionNew";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home },
        { path: '/login', component: Login },
        { path: '/register', component: Register },
        { path: '/user/cockpit/overview', component: UserCockpitOverview },
        { path: '/question/new', component: QuestionNew },
        { path: '/answer/new', component: AnswerNew}
    ]
})

export default router;