module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    env: {
        browser: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'airbnb-base'
    ],
    rules: {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1,
                "CallExpression": {
                    "arguments": "first"
                }
            }
        ],
        "no-multi-spaces": [
            "error",
            {
                "exceptions": {
                    "VariableDeclarator": true
                }
            }
        ],
        "camelcase": false,
        "strict": false,
        "no-else-return": false,
        "max-len": [
            "error",
            {
                "code": 150
            }
        ],
        "key-spacing": [
            "error",
            {
                "align": {
                    "beforeColon": true,
                    "afterColon": true,
                    "true": "colon"
                }
            }
        ],
        "comma-dangle": [
            "error",
            "never"
        ],
        "arrow-parens": [
            "error",
            "always"
        ],
        "no-plusplus": [
            "error",
            {
                "allowForLoopAfterthoughts": true
            }
        ],
        "no-param-reassign": [
            "error",
            {
                "props": false
            }
        ],
        "prefer-destructuring": false,
        "consistent-return": false,
        "no-eval": "error",
        "no-implied-eval": "error"
    }
};
