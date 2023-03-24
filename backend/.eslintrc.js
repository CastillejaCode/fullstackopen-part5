module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
		jest: true,
		cypress/globals: true
	},
	extends: ['airbnb-base', 'prettier'],
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	plugins: [
        "react", "jest", "cypress"
    ],
	rules: {
		'no-console': 0,
		'no-underscore-dangle': 0,
		'no-param-reassign': 0,
		'prefer-destructuring': 0,
		'consistent-return': 0,
		'no-restricted-syntax': 0,
		'import/no-extraneous-dependencies': 0,
	},
};
