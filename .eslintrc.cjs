module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: ['xo', 'xo-typescript'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'@typescript-eslint/comma-dangle': 'off',
		'@typescript-eslint/naming-convention': 'off',
		'@typescript-eslint/indent': 'off',
		'object-shorthand': 'off',
		'arrow-body-style': 'off',
	},
	ignorePatterns: ['dist'],
};
