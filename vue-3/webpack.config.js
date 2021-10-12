const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, './src/index'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'vue.js'
  }
}