import {defineStore} from "pinia";

export const useFavCatsStore = defineStore('favoriteCategories', {
    state: () => ({
        favs: [],
    }),
    getters: {
        getFavs: (state) => {
            return state.favs;
        }
    },
    actions: {
        setFavs(favs) {
            this.favs = favs;
        }
    }
});