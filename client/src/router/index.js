import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import UserCockpitView from "@/views/UserCockpitView.vue";
import QuestionView from "@/views/QuestionView.vue";
import QuestionNewView from "@/views/QuestionNewView.vue";
import AdminCockpitView from "@/views/AdminCockpitView.vue";
import CategoryQuestions from "@/views/CategoryQuestions.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {name: "Home", path: '/', component: HomeView},
        {name: "Administration", path: '/admin', component: AdminCockpitView},
        {name: "Registration", path: '/register', component: RegisterView},
        {name: "User Cockpit", path: '/user', component: UserCockpitView},
        {name: "Question New", path: '/question/new', component: QuestionNewView},
        {name: "Question View", path: '/question/:id', component: QuestionView, props: true},
        {name: 'Category Questions', path: '/categories/:id', component: CategoryQuestions, props: true},
    ]
})

export default router;