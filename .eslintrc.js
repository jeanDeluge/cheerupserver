module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2020": true
    },
    "extends": [
        "airbnb-base",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "plugins": [
        "@typescript-eslint",
        "require"
    ],
    "rules": {
        "no-plusplus": "off",
        "@typescript-eslint/no-explicit-any": "off"
    }
}