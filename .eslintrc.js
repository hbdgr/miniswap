module.exports = {
  env: {
    node: true,
    es6: true,
    mocha: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  extends: [
    "standard",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "quote-props": "off",
    "space-before-function-paren": [
      "error", {
        "anonymous": "always",
        "named": "ignore",
        "asyncArrow": "always",
      },
    ],
  },
};
