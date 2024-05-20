const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/scripts/app.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    devServer: {
        static: '.dist/index.html',
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            // title : './main.js',
            template: './index.html' //
        }),
        new CopyPlugin({
            patterns: [
                { from: "templates", to: "templates" },
                { from: "src/styles", to: "styles" },
                { from: "static", to: "static" },
            ],
        }),
    ],
};