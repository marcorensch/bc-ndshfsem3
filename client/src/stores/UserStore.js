import { defineStore } from "pinia";

export const useUserStore = defineStore('userdata',{
    state: () => ({
        user: {
            id: 0,
            username: "",
            firstname: "",
            lastname: "",
            email: "",
            isadministrator: false,
            token: "",
            refreshToken: "",
        }
    }),
    getters: {
        isAdmin: (state) => {
            return state.user.isadministrator;
        }
    },
    actions: {
        setUser(user){
            this.user = user;
        },
        clearUser(){
            this.user = {
                id: 0,
                username: "",
                firstname: "",
                lastname: "",
                email: "",
                isadministrator: false,
                token: "",
                refreshToken: "",
            }
        },
        setToken(token){
            this.user.token = token;
        },
        setRefreshToken(refreshToken){
            this.user.refreshToken = refreshToken;
        }
    }
});