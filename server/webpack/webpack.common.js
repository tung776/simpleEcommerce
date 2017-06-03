var path = require("path");
var webpack = require("webpack");
var extractTextWebpackPlugin = require("extract-text-webpack-plugin");
var htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry:{
        css: "./entry.css.js"
    },
    output: {
        path: path.resolve('public'),
        filename: '[name].bundle.js'
    },
     module: {
        rules:[
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            // publicPath: path.resolve('dist')+ "/js"
        },
        {
            test: /\.css$/,
            use: extractTextWebpackPlugin.extract({
                fallback: 'style-loader',
                loader: ['css-loader', 'sass-loader'],
                publicPath: path.resolve(__dirname, 'public')
            })
            
        }
        ]
        
    },
    
    plugins: [
        
        new extractTextWebpackPlugin({
            filename: 'style.css',
            allChunks: true,
             disable: process.env.APP_ENV == 'production'
        }),
         new webpack.HotModuleReplacementPlugin(),
    ]
}