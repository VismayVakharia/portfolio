import eslintPluginPrettier from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";
import js from "@eslint/js";
import eslintPluginImport from "eslint-plugin-import";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      prettier: eslintPluginPrettier,
      import: eslintPluginImport,
    },
    rules: {
      "prettier/prettier": "error",
      "import/order": ["warn", { "newlines-between": "always" }],
    },
  },
  {
    ignores: ["node_modules", "dist"],
  },
];
