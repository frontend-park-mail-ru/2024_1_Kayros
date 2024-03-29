module.exports = {
	env: {
		node: true,
		browser: true,
		es2021: true,
	},
	plugins: ['unused-imports', '@stylistic/js', 'jsdoc'],
	extends: ['eslint:recommended', 'plugin:import/recommended', 'plugin:jsdoc/recommended-error'],
	overrides: [
		{
			files: ['.*'],
			rules: {
				'eol-last': ['error', 'always'],
				semi: 'off',
				'no-undef': 'off',
				indent: 'off',
			},
		},
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
		'no-console': ['error', { allow: ['warn', 'error'] }],
		'no-unused-vars': 'off',
		'unused-imports/no-unused-imports': 'error',
		'unused-imports/no-unused-vars': 'error',
		'import/no-cycle': 'error',
		'@stylistic/js/padding-line-between-statements': [
			'error',
			{
				blankLine: 'always',
				prev: ['multiline-expression', 'multiline-let', 'multiline-const', 'multiline-block-like'],
				next: '*',
			},
			{ blankLine: 'always', prev: '*', next: ['export', 'block-like', 'class'] },
		],
		'no-multiple-empty-lines': ['error', { max: 1 }],
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
					{
						pattern: '*.scss',
						group: 'sibling',
						position: 'after',
					},
				],
			},
		],
		'jsdoc/require-jsdoc': ['error', { require: { ClassDeclaration: true, MethodDefinition: true } }],
	},
};
