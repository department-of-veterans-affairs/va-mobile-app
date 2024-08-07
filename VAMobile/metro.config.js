const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const path = require('path')

const defaultConfig = getDefaultConfig(__dirname)
const { assetExts, sourceExts } = defaultConfig.resolver

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false, // Disable inline requires
      },
    }),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg' && ext !== 'png'),
    sourceExts: [...sourceExts, 'svg', 'png'],
  },
  watchFolders: [path.resolve(__dirname, 'node_modules/@department-of-veterans-affairs/mobile-assets')],
}

module.exports = mergeConfig(defaultConfig, config)
