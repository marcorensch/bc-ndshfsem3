import "bootstrap/dist/css/bootstrap.min.css"
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'


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
    faChevronLeft, faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

library.add(faChevronLeft,faChevronRight, faUpload, faAnglesRight, faUser, faCrown, faHouse, faKey, faXmark, faUserPlus, faComment, faRightFromBracket);

const app = createApp(App)
app.component("font-awesome-icon", FontAwesomeIcon)
app.use(router)
app.provide('host', process.env.VUE_APP_HTTPS === "true" ? "https://localhost:" + process.env.VUE_APP_SERVER_PORT : "http://localhost:" + process.env.VUE_APP_SERVER_PORT)
app.mount('#app')

import "bootstrap/dist/js/bootstrap.js"