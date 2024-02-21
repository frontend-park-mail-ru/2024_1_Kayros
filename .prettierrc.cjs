module.exports = {
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: 'auto',
  printWidth: 120,
  singleQuote: true,
  semi: true,
  useTabs: true,
  overrides: [
    {
      files: ['**.*.css', '*.css'],
      options: {
        singleQuote: false,
      },
    },
  ],
}
