import globals from "globals";
import jsPlugin from "@stylistic/eslint-plugin-js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest",
      globals: globals.node,
    },
    plugins: {
      "@stylistic/js": jsPlugin,
    },
    rules: {
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/linebreak-style": ["error", "unix"],
      "@stylistic/js/quotes": ["error", "single"],
      "@stylistic/js/semi": ["error", "never"],
      "eqeqeq": "error",
      "no-trailing-spaces": "error", 
      "object-curly-spacing": ["error", "always"], 
      "arrow-spacing": ["error", { "before": true, "after": true }], 
      'no-console': 0 
    },
    ignores: ["node_modules/**", "dist/**"],

  },
];
