// eslint.config.js
// This is the new "flat config" file format for ESLint v9+.
// It will now only lint YAML files.

// Import only the necessary YAML plugin
const yaml = require('eslint-plugin-yaml')

module.exports = [
  // 1. Global configuration for all files
  {
    ignores: ['node_modules/', 'dist/', 'build/'],
  },

  // 2. Configuration for YAML files (.yml, .yaml)
  {
    files: ['**/*.yaml', '**/*.yml'],
    // Apply the recommended rules from the YAML plugin
    ...yaml.configs.recommended,
  },
]
