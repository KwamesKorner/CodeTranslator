const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require("dotenv-webpack");
const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index_bundle.js'
  },
  mode: 'production',
  module: {
    rules: [
        {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: 'file-loader'
        }
    ]
  },
  plugins: [
    new Dotenv({
        systemvars: true
    }),
    new HtmlWebpackPlugin({
        template: './public/index.html'
    }),
    new MiniCssExtractPlugin({
        filename: 'App.css'
    }),
    new webpack.ProvidePlugin({
        process: 'process/browser',
    }),
    // new WebpackPwaManifest({
    //     filename: 'manifest.json',
    //     name: 'My PWA',
    //     short_name: 'My PWA',
    //     description: 'My Progressive Web App',
    //     background_color: '#ffffff',
    //     theme_color: '#ffffff',
    //     icons: [
    //       {
    //         src: path.resolve('public/apple-touch-icon.png'),
    //         sizes: [128]
    //       }
    //     ]
    //   })
  ]
}