var path = require("path");
var common = require("./webpack.common");
var merge = require("webpack-merge");

module.exports = merge(common, {
    output: {
        path: path.resolve("public"),
        filename: "[name].bundle.js"
    }
});