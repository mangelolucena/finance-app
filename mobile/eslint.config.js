const reactNative = require("eslint-plugin-react-native");
const tseslint = require("typescript-eslint");

module.exports = [
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-native": reactNative,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "react-native/no-unused-styles": "warn",
      "react-native/no-inline-styles": "warn",
    },
  },
];