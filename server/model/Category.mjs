import CategoryHelper from "../helper/CategoryHelper.mjs";

class Category {
    id;
    title;
    alias;
    #createdExternalCheck = false;
    /**
     * @private
     */
    constructor(title) {
        this.title = title;
        this.alias = null;
    }

    static async create(title, connectionData) {
        const instance = new Category(title);
        instance.connectionData = connectionData;
        instance.alias = instance.title.toLowerCase().replace(/ /g, "-");
        instance.alias = await instance.standardizeAlias();
        return instance;
    }

    async standardizeAlias(){
        const categoryHelper = new CategoryHelper(this.connectionData);
        let alias = this.alias.replace(/[^a-z0-9\-]+/, "");
        let aliasIndex = 1;
        while( await categoryHelper.doesAliasExists(alias) && aliasIndex < 100){
            alias = alias.split("-").filter(part => isNaN(part)).join("-") + "-" + aliasIndex;
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