import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import UserCockpitOverview from "@/views/UserCockpitOverview";
import AnswerNew from "@/views/AnswerNew";
import QuestionNew from "@/views/QuestionNew";
import UserCockpitEdit from "@/views/UserCockpitEdit";
import AdminCockpitOverview from "@/views/AdminCockpitOverview";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {name: "Home", path: '/', component: Home},
        {path: '/register', component: Register},
        {path: '/user/cockpit/overview', component: UserCockpitOverview},
        {path: '/question/new', component: QuestionNew},
        {path: '/answer/new', component: AnswerNew},
        {path: '/user/cockpit/edit', component: UserCockpitEdit},
        {path: '/admin/cockpit/overview', component: AdminCockpitOverview}
    ]
})

export default router;