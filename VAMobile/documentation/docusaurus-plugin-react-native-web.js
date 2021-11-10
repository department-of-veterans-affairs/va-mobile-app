const path = require("path");

const appDirectory = path.resolve(__dirname);

const {presets} = require(`${appDirectory}/babel.config.js`);

const compileNodeModules = [
  // Add every react-native package that needs compiling
   'react-native',
   'react-native-keychain',
   'rn-fetch-blob',
    'react-native-webview',
    
].map((moduleName) => path.resolve(`../node_modules/${moduleName}`));

const babelLoaderConfiguration = {
  test: /\.js$|tsx|ts|jsx?$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
     path.resolve('../src/components'), // Entry to your application
    path.resolve( './src/*'),

    ...compileNodeModules,
  ],
  exclude: [
    path.resolve('../src/store'), 
    path.resolve('../node_modules/@react-native-community/cookies'), 

  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets,
      plugins: ['react-native-web'],
    },
  },
};

const svgLoaderConfiguration = {
  test: /\.svg$/,
  use: [
    {
      loader: 'file-loader',

    },
  ],
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
    },
  },
};

module.exports = function() {
  return {
    name: 'docusaurus-plugin-react-native-web',
    configureWebpack(_config, isServer, utils) {
      return { 
 
  resolve: {
    extensions: [".ts", ".tsx", ".jsx", ".js"],
    alias: {
      "react-native$": "react-native-web",
      "@componentsDocs": "../../../../src/components",
      "@componentsSubDirectoryDocs": "../../../../../src/components"

    },
  },
  module: {
    rules: [
     babelLoaderConfiguration,
       imageLoaderConfiguration,
     svgLoaderConfiguration,
   
     
   ],
 },
 
}}
  }
}