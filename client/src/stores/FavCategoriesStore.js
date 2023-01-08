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
        },
        addFav(fav) {
            this.favs.push(fav);
        },
        removeFav(fav) {
            this.favs = this.favs.filter(f => f.id !== fav.id);
        }
    },
    // persist: {
    //     enabled: true,
    //     key: 'userdata',
    //     storage: localStorage,
    // }
});