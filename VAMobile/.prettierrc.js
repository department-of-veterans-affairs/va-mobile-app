module.exports = {
  bracketSameLine: true,
  bracketSpacing: true,
  importOrder: [
    '^react',
    '^@react',
    '<THIRD_PARTY_MODULES>',
    '^(api|components|constants|screens|store|styles|testUtils|translations|utils)',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  singleQuote: true,
  trailingComma: 'all',
  semi: false,
  useTabs: false,
  printWidth: 120,
}
