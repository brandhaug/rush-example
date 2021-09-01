const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const excludeNodeModulesExcept = (modules) => {
  let pathSep = path.sep
  if (pathSep == '\\') {
    // must be quoted for use in a regexp:
    pathSep = '\\\\'
  }
  const moduleRegExps = modules.map((modName) => new RegExp('node_modules' + pathSep + modName))

  return function (modulePath) {
    if (/node_modules/.test(modulePath)) {
      for (var i = 0; i < moduleRegExps.length; i++) {
        if (moduleRegExps[i].test(modulePath)) {
          console.log(modulePath)
          return false
        }
      }
      return true
    }
    return false
  }
}

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: { path: path.join(__dirname, 'dist'), filename: 'index.bundle.js' },
  mode: process.env.NODE_ENV || 'development',
  resolve: { modules: [path.resolve(__dirname, 'src'), 'node_modules'] },
  devServer: { static: { directory: path.join(__dirname, 'src') } },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: excludeNodeModulesExcept(['@rush-example']),
        use: ['babel-loader']
      },
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html')
    })
  ]
}
