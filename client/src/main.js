import "bootstrap/dist/css/bootstrap.min.css"
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'


import {library} from "@fortawesome/fontawesome-svg-core";
import {
    faUpload, faAnglesRight, faUser, faCrown, faHouse, faKey, faXmark, faUserPlus, faComment,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

library.add(faUpload, faAnglesRight, faUser, faCrown, faHouse, faKey, faXmark, faUserPlus, faComment);

const host = process.env.VUE_APP_HTTPS ? "https://localhost:"+process.env.VUE_APP_SERVER_PORT : "http://localhost:"+process.env.VUE_APP_SERVER_PORT;

createApp(App)
    .component("font-awesome-icon", FontAwesomeIcon)
    .use(router)
    .provide("host", host)
    .mount('#app')

import "bootstrap/dist/js/bootstrap.js"