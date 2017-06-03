var path =  require("path");
var merge = require("webpack-merge");
var common = require("./webpack.common");

module.exports = merge(common, {
    output: {
        path: path.resolve("public"),
        filename: "[name].bundle.js"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ]
});