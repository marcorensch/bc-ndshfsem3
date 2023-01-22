import CategoryHelper from "../helper/CategoryHelper.mjs";
import TagHelper from "../helper/TagHelper.mjs";

class Tag {
    id;
    title;
    alias;

    constructor(title) {
        this.title = title;
        this.alias = null;
    }
    static async create(title, connectionData) {
        const instance = new Tag(title);
        instance.connectionData = connectionData;
        instance.alias = instance.title.toLowerCase().replace(/ /g, "-");
        instance.alias = await instance.standardizeAlias();
        return instance;
    }
    async standardizeAlias(){
        const tagHelper = new TagHelper(this.connectionData);
        let alias = this.alias.replace(/[^a-z0-9\-]+/, "");
        let aliasIndex = 1;
        while( await tagHelper.doesAliasExists(alias) && aliasIndex < 100){
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

export default Tag;