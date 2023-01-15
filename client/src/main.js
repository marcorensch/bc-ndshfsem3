import "bootstrap/dist/css/bootstrap.min.css"
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";

import {library} from "@fortawesome/fontawesome-svg-core";
import {
    faUpload,
    faAnglesRight,
    faUser,
    faCrown,
    faHouse,
    faKey,
    faXmark,
    faUserPlus,
    faComment,
    faRightFromBracket,
    faChevronLeft,
    faChevronRight,
    faCogs,
    faTrash,
    faPencil,
    faSave,
    faStar,
    faUsers,
    faBoxes,
    faTags,
    faSort,
    faQuestion,
    faCalendar,
    faBox,
    faTag,
    faCaretUp,
    faCaretDown,
    faCheck,
    faMinusSquare,
    faCheckSquare,
    faChevronDown,
    faKeyboard
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

library.add(faKeyboard, faChevronDown, faMinusSquare, faCheckSquare, faCheck, faCaretUp, faCaretDown, faTag, faCalendar, faBox, faQuestion, faSort, faTags, faBoxes, faUsers, faChevronLeft, faTrash, faPencil, faSave, faStar, faChevronRight, faCogs, faUpload, faAnglesRight, faUser, faCrown, faHouse, faKey, faXmark, faUserPlus, faComment, faRightFromBracket);
const pinia = createPinia();
pinia.use(piniaPersist);

const app = createApp(App)
app.component("font-awesome-icon", FontAwesomeIcon)
app.use(router)
app.use(pinia)
app.provide('host', process.env.VUE_APP_HTTPS === "true" ? "https://localhost:" + process.env.VUE_APP_SERVER_PORT : "http://localhost:" + process.env.VUE_APP_SERVER_PORT)
app.mount('#app')

import "bootstrap/dist/js/bootstrap.js"