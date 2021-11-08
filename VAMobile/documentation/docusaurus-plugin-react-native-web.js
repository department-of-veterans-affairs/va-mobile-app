const path = require("path");

const appDirectory = path.resolve(__dirname);

const {presets} = require(`${appDirectory}/babel.config.js`);

const compileNodeModules = [
  // Add every react-native package that needs compiling
   'react-native',
   'react-native-keychain',
   'rn-fetch-blob',
   '@react-native-cookies/cookies',
    "@expo/react-native-action-sheet",
    "@react-native-async-storage/async-storage",
    "@react-native-community/clipboard",
    "@react-native-community/datetimepicker",
    "@react-native-community/picker",
    "@react-native-cookies/cookies",
    "@react-native-firebase/analytics",
    "@react-native-firebase/app",
    "@react-native-firebase/crashlytics",
    "react-native-document-picker",
    "react-native-dotenv",
    "react-native-file-viewer",
    "react-native-image-picker",
    "react-native-keyboard-manager" ,
    "react-native-localize",
    "react-native-notifications",
    "react-native-reanimated",
    "react-native-responsive-screen",
    "react-native-safe-area-context",
    "react-native-screens",
    "react-native-svg",
    "react-native-svg-transformer",
    "react-native-webview",
    
].map((moduleName) => path.resolve(`../node_modules/${moduleName}`));

const babelLoaderConfiguration = {
  test: /\.js$|tsx|ts|jsx?$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
     path.resolve('../src'), // Entry to your application
    path.resolve( './src/*'),

    ...compileNodeModules,
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

module.exports = function() {
  return {
    name: 'docusaurus-plugin-react-native-web',
    path: path.resolve(__dirname, 'docusaurus-plugin/src'),
    configureWebpack(_config, isServer, utils) {
      return { module: {
   rules: [
     babelLoaderConfiguration,
     {
       test: /\.(gif|jpe?g|png|svg)$/,
       use: {
         loader: "url-loader",
         options: {
           name: "[name].[ext]",
           esModule: false,
         },
       },
     },
      {
       test: /\.(js)?$/,
       include: path.resolve(__dirname, "src"),
       use: [
         {
           loader: "raw-loader",
         }
       ],
     },
   ],
 },
 resolve: {
   extensions: [".ts", ".tsx", ".jsx", ".js"],
   alias: {
     "react-native$": "react-native-web",
   },
 },
 
}}
  }
}