import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import UserCockpitOverview from "@/views/UserCockpitOverview";
import AnswerNew from "@/views/AnswerNew";
import QuestionNew from "@/views/QuestionNew";
import UserCockpitEdit from "@/views/UserCockpitEdit";
import AdminCockpitOverview from "@/views/AdminCockpit.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {name: "Home", path: '/', component: Home},
        {name: "Administration", path: '/admin/cockpit', component: AdminCockpitOverview},
        {path: '/register', component: Register},
        {path: '/user/cockpit/overview', component: UserCockpitOverview},
        {path: '/question/new', component: QuestionNew},
        {name: "New Answer", path: '/answer/new/:id', component: AnswerNew, props: true},
        {path: '/user/cockpit/edit', component: UserCockpitEdit},
    ]
})

export default router;