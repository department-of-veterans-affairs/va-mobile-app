const { getDefaultConfig } = require('metro-config')

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path')

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig()
  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
    watchFolders: [
      // path.resolve(__dirname, '../../Mobile Platform/va-mobile-temporary/packages/components'),
      // path.resolve(__dirname, '../../Mobile Platform/va-mobile-temporary/packages/components/node_modules'),
      path.resolve(__dirname, './node_modules')],
  }
})()
