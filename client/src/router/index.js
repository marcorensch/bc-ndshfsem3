import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import UserCockpitOverview from "@/views/UserCockpitOverview";
import QuestionView from "@/views/QuestionView.vue";
import QuestionNew from "@/views/QuestionNew";
import UserCockpitEdit from "@/views/UserCockpitEdit";
import AdminCockpitOverview from "@/views/AdminCockpit.vue";
import CategoryQuestions from "@/views/CategoryQuestions.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {name: "Home", path: '/', component: Home},
        {name: "Administration", path: '/admin/cockpit', component: AdminCockpitOverview},
        {path: '/register', component: Register},
        {path: '/user/cockpit/overview', component: UserCockpitOverview},
        {path: '/question/new', component: QuestionNew},
        {name: "Question View", path: '/question/:id', component: QuestionView, props: true},
        {path: '/user/cockpit/edit', component: UserCockpitEdit},
        {name: 'CategoryQuestions', path: '/categories/:id', component: CategoryQuestions, props: true},
    ]
})

export default router;