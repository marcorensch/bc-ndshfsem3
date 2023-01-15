import {defineStore} from "pinia";

export const useUserStore = defineStore('userdata', {
    state: () => ({
        user: {
            id: null,
            username: null,
            email: null,
            firstname: null,
            lastname: null,
            isadministrator: null,
            token: null,
            refreshToken: null,
        },
        answerText: null,
    }),
    getters: {
        isAdmin: (state) => {
            return state.user.isadministrator;
        },
        isLoggedIn: (state) => {
            return state.user.token && state.user.id;
        },
        getTokens: (state) => {
            return {
                token: state.user.token,
                refreshToken: state.user.refreshToken
            }
        },
        getAnswerText: (state) => {
            return state.answerText;
        },
        getReqHeaders: (state) => {
            return {
                'Authorization': `Bearer ${state.user.token}`,
                'RefreshToken': `${state.user.refreshToken}`,
            }
        }
    },
    actions: {
        setUser(user) {
            this.user = user;
        },
        setToken(token) {
            this.user.token = token;
        },
        setRefreshToken(refreshToken) {
            this.user.refreshToken = refreshToken;
        },
        logout() {
            this.user = {
                id: null,
                username: null,
                email: null,
                firstname: null,
                lastname: null,
                isadministrator: null,
                token: null,
                refreshToken: null,
            }
        },
        setAnswerText(text) {
            this.answerText = text;
        },
        clearAnswerText() {
            this.answerText = null;
        }
    },
    persist: {
        enabled: true,
        key: 'userdata',
        storage: localStorage,
    }
});