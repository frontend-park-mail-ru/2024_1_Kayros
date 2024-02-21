const isProd = process.env.NODE_ENV === 'production';

module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['eslint:recommended', 'plugin:import/recommended'],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		indent: ['error', 'tab'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'no-unused-vars': 1,
		'no-console': isProd ? 'error' : 'off',
		'import/order': [
			'error',
			{
				groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
				alphabetize: {
					order: 'asc',
				},
				pathGroups: [
					{
						pattern: '*.css',
						group: 'sibling',
						position: 'after',
					},
				],
			},
		],
	},
};
