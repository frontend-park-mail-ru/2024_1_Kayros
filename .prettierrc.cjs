module.exports = {
	bracketSameLine: false,
	bracketSpacing: true,
	endOfLine: 'auto',
	printWidth: 120,
	singleQuote: true,
	semi: true,
	useTabs: true,
	arrowParens: 'always',
	trailingComma: 'all',
	overrides: [
		{
			files: ['**.*.scss', '*.scss', '**.*.css', '*.css', '*.hbs'],
			options: {
				singleQuote: false,
			},
		},
	],
};
