module.exports = {
  assets: ['./assets/fonts/', './node_modules/@department-of-veterans-affairs/mobile-assets'],
  dependencies: {
    // Exclude react-native-wallet-pass from Android builds (iOS only)
    'react-native-wallet-pass': {
      platforms: {
        android: null,
      },
    },
  },
}
