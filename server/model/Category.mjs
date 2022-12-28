class Category {
    id;
    title;
    alias;
    constructor(title, alias = false) {
        this.title = title;
        console.log(this.title)
        this.alias = alias ? alias : this.aliasConstructor();
    }

    aliasConstructor(){
        /*
        @ToDo: Handle special characters
        @ToDo: Handle Duplicates (check if alias exists)
         */
        console.log("Alias constructor");
        console.log(this.title);
        const alias = this.title.toLowerCase().replace(/ /g,"-");
        return alias;
    }

    setId(id) {
        this.id = id;
        return this;
    }
}

export default Category;