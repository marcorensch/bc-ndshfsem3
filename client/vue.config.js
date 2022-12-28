const {defineConfig} = require("@vue/cli-service");
const fs = require('fs')

module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    devServer: {
        https: {
            key: fs.readFileSync('certs/example.com+5-key.pem'),
            cert: fs.readFileSync('certs/example.com+5.pem'),
        }
    },
});
