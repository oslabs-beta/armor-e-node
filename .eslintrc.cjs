//const { default: ts } = require("typescript");

module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: ['airbnb-typescript/base'],
    rules: {
        'import/extensions': [
            'error', 
            'ignorePackages',
        {
        'js': 'never',
        'jsx': 'never',
        'ts': 'never',
        'tsx': 'never'
        }
    ]
    },
    parserOptions: {
        project: './tsconfig.json'
    },
    settings: { react: { version: 'detect' } },
    plugins: ['import'],
}
