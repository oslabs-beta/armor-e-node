const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

export default [
    ...[
        eslint.configs.recommended,
        ...tseslint.configs.recommended
    ].map(conf=> ({
        ...conf,
        files: ["**/*.ts"],
    })),
    {
        files: ['**/*.ts'],
        ignores: ["**/*test.js"],
        rules: {
            "semi": "error",
            "no-unused-vars": "error",
            "@typescript-eslint/array-type": "error",
            "@typescript-eslint/consistent-type-imports": "error",
        }
    }
];

