import CategoryHelper from "../helper/CategoryHelper.mjs";

class Category {
    id;
    title;
    alias;
    static #isInternalConstructing = false;
    constructor(title, alias) {
        if (!Category.#isInternalConstructing) {
            throw new TypeError("Category is not constructable, call static create() instead");
        }
        this.title = title;
        this.alias = alias;
    }

    static async create(title, alias) {
        Category.#isInternalConstructing = true;
        if(!alias){
            alias = title.toLowerCase().replace(/ /g, "-");
        }
        alias = await Category.standardizeAlias(alias);
        const instance = new Category(title, alias);
        Category.#isInternalConstructing = false;
        return instance;
    }

    static async standardizeAlias(alias){
        const categoryHelper = new CategoryHelper();
        console.log("Alias: " + alias);
        alias = alias.replace(/[^a-z0-9\-]+/, "");
        let aliasIndex = 1;
        while(await categoryHelper.checkAliasExists(alias)){
            alias = alias.split("-")[0] + "-" + aliasIndex;
            aliasIndex++;
        }
        return alias;
    }

    setId(id) {
        this.id = id;
        return this;
    }
}

export default Category;