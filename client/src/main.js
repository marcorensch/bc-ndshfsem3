import "bootstrap/dist/css/bootstrap.min.css"
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

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
    faKeyboard, faChartBar, faHistory
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

library.add(faHistory, faChartBar, faKeyboard, faChevronDown, faMinusSquare, faCheckSquare, faCheck, faCaretUp, faCaretDown, faTag, faCalendar, faBox, faQuestion, faSort, faTags, faBoxes, faUsers, faChevronLeft, faTrash, faPencil, faSave, faStar, faChevronRight, faCogs, faUpload, faAnglesRight, faUser, faCrown, faHouse, faKey, faXmark, faUserPlus, faComment, faRightFromBracket);
const pinia = createPinia();
pinia.use(piniaPersist);

const editorInit = {
    skin: false,
    branding: false,
    height: "300",
    menubar: false,
    contextmenu: false,
    resize: false,
    toolbar: 'undo redo | bold italic underline codesample | link image',
    font_formats: "Arial=arial,helvetica,sans-serif;",

    formats: {
        // Changes the default format for h1 to have a class of heading
        p: {block: 'p'}
    },
    style_formats: [
        // Adds the h1 format defined above to style_formats
        {title: 'Paragraph', format: 'p'}
    ],
    plugins: 'lists link image codesample help wordcount',
    content_css: false,
    content_style: "body { font-family: Arial; }",

};

const toastOptions = {};

const app = createApp(App)
app.component("font-awesome-icon", FontAwesomeIcon)
app.use(router)
app.use(pinia)
app.use(Toast, toastOptions);
app.provide("editorInit", editorInit)
app.provide('host', process.env.VUE_APP_HTTPS === "true" ? "https://localhost:" + process.env.VUE_APP_SERVER_PORT : "http://localhost:" + process.env.VUE_APP_SERVER_PORT)
app.mount('#app')

import "bootstrap/dist/js/bootstrap.js"