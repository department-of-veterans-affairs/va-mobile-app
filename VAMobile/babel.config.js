module.exports = {
  presets: ['module:@react-native/babel-preset', '@babel/preset-typescript'],

  plugins: [
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    ['@babel/plugin-transform-runtime'],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: process.env.DOT_ENV_FILE || 'env/.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['src'],

        extensions: ['.js', '.jsx', '.ts', '.tsx', '.android.js', '.android.tsx', '.ios.js', '.ios.tsx'],
      },
    ],
  ],
}
