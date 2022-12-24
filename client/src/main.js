import "bootstrap/dist/css/bootstrap.min.css"
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


import {library} from "@fortawesome/fontawesome-svg-core";
import {
    faUpload, faAnglesRight,faUser,faCrown,faHouse, faKey,faXmark,faUserPlus,faComment,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

library.add(faUpload, faAnglesRight, faUser, faCrown,faHouse, faKey, faXmark, faUserPlus, faComment);


createApp(App)
    .component("font-awesome-icon", FontAwesomeIcon)
    .use(router)
    .mount('#app')

import "bootstrap/dist/js/bootstrap.js"