const {defineConfig} = require("@vue/cli-service");
const fs = require('fs')

module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    devServer: devServerConfig(),
});

function devServerConfig(){
    console.log("Configuring dev server");
    console.log("Use https: " + process.env.VUE_APP_HTTPS);
    if(process.env.VUE_APP_HTTPS === "true"){
        console.log("Using https");
        return {
            https: {
                key: fs.readFileSync('certs/example.com+5-key.pem'),
                cert: fs.readFileSync('certs/example.com+5.pem'),
            }
        }
    }
    return {};
}
