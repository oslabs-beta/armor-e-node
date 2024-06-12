// import eslint from 'eslint/js'
// import tseslint from 'typescript-eslint'

// export default [
//     {
//         ...eslint.configs.recommended,
//         files: ["**/*.ts"],
//     },
//     {
//         ...tseslint.configs.recommended,
//         files: ['**/*.ts'],
//         ignores: ["**/*test.js"],
//         rules: {
//             "semi": "error",
//             "no-unused-vars": "error",
//             "@typescript-eslint/array-type": "error",
//             "@typescript-eslint/consistent-type-imports": "error",
//         }
//     }
// ];

// module.exports = {
//     extends: [
//         'airbnb',
//         'airbnb-typescript/base'
//     ],
//     parser: '@typescript-eslint/parser',
//     parserOptions: {
//         project: './tsconfig.json'
//     },
//     plugins: [
//         '@typescript-eslint'
//     ]
// }

module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: ['airbnb-typescript/base'],
    rules: {
        'import/extensions': [
            'error', 
            'ignorePackages',
        {js: 'never',
        jsx: 'never',
        }
    ]
    },
    parserOptions: {
        project: './tsconfig.json'
    },
    settings: { react: { version: 'detect' } },
    plugins: ['import'],
}
