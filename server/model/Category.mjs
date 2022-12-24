class Category {
    title;
    alias;
    constructor(title, alias = false) {
        this.title = title;
        this.alias = alias ? alias : this.aliasConstructor();
    }

    aliasConstructor(){
        /*
        @ToDo: Handle special characters
        @ToDo: Handle Duplicates (check if alias exists)
         */
        const alias = this.title.toLowerCase().replace(/ /g,"-");
        return alias;
    }
}

export default Category;