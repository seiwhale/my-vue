const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'vue.js',
  },
  devServer: {
    port: 8080,
    open: true,
    hot: true,
    static: {
      directory: 'www',
      serveIndex: true
    },
  },
  plugins:[
    // new HtmlWebpackPlugin({
    //   // chunks: ['vue'],
    //   template: 'www/index.html',
    // })
  ]
}